import { generateRewardImage } from '../services/imageGenerationServices.js';
import { getQuizCorrectCompletions } from '../services/dbServices.js';

/**
 * NOTE: I made these typedefs to help with documentation,
 *  and to know what the bot will need to send to
 *  and what it will receive from the quiz engine.
 */

/**
 * @typedef {Object} Completion
 * @property {string} userId - user ID
 * @property {string} displayName - user's display name
 * @property {string} profilePicture - URL to user's profile picture
 * @property {boolean} correct - whether the user answered correctly
 * @property {string} completionDate - ISO date string of when the user completed the quiz
 */

/**
 * @typedef {Object} RequestBody
 * @property {string} quizId - ID of the quiz, created when it was generated
 * (`quizzes` table primary key)
 */

/**
 * @typedef {Object} TopUser
 * @property {string} userId - user ID
 * @property {string} displayName - user's display name
 * @property {string} profilePicture - URL to user's profile picture
 * @property {string} rewardImage - URL to the generated reward image
 */

/**
 * Given the completions of a quiz, return the 3 users who completed the quiz first
 * and correctly, along with AI images for each winner
 */
export async function handleResults(req, res) {
  //console.log("Am intrat în handleResults!");

  /** @type {RequestBody} */
  const { quizId } = req.body;

  if (!quizId) {
    return res.status(400).json({
      message: "Invalid request body. Missing 'quizId'."
    });
  }

  // get completions from the database
  const completions = await getQuizCorrectCompletions(quizId);
  //console.log("Completări corecte din DB:", completions);

  // if no completions, return empty array
  if (completions.length === 0) {
    //console.log("Top 3 înainte de generare imagini:", topUsers);
    return res.json({ topUsers: [] });
  }

  // filter out the first 3 users who completed the quiz correctly
  // NOTE: we already fetched already correct completions from the DB so no need to filter again
    const sortedCompletions = completions.sort((a, b) => {
      // handle null or undefined completion dates
      if (!a.completion_date) return 1; // a is later, will be last
      if (!b.completion_date) return -1; // b is later, will be last
      return new Date(a.completion_date) - new Date(b.completion_date)
    });

    const topUsers = sortedCompletions.slice(0, 3);
    //trimite locu 4,5,6 la locu 1,2,3
    const otherUsers = sortedCompletions.slice(0, 3);
    //trimite locu 4,5,6+ la locu 4,5,6+
    //const otherUsers = sortedCompletions.slice(3);

  // for each user, generate a reward image
  /**  @type {TopUser[]} */
  const topUsersWithImages = await Promise.all(
    topUsers.map(async (user) => {

      // check if user profile picture and display name are given
      const profilePicture = user.user_data?.profile_picture_url || null;
      const displayName = user.user_data?.display_name || '';

      if (!profilePicture || !displayName) {
        console.warn(`Cannot generate reward image of user with ID ${user.user_id} without profile picture and display name.`);
        return {
          ...user,
          rewardImage: null,
        };
      }

      try {
        //console.log(`Generez imagine pentru ${displayName} cu poza: ${profilePicture}`);

        user.rewardImage = await generateRewardImage({
          imageUrl: profilePicture,
          userDisplayName: displayName
        });
        //console.log(`Imagine generată pentru ${displayName}: ${user.rewardImage}`);


        return user;

      } catch (error) {
        console.error(`Failed to generate image for ${displayName}:`, error);

        return {
          ...user,
          rewardImage: null
        };
      }
  }));
  const otherUsersWithPlacement = otherUsers.map((user, index) => ({
    ...user,
    placement: index + 4  // pentru că primii 3 sunt deja în top
  }));

  return res.status(200).json({
    topUsersWithImages,
    otherUsersWithPlacement
  });
}
