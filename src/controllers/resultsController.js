import { generateRewardImage } from '../services/imageGenerationServices.js';

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
 * @property {Completion[]} completions - array of all user completions
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
  /** @type {RequestBody} */
  const { quizId, completions } = req.body;

  if (!quizId || !Array.isArray(completions)) {
    return res.status(400).json({
      message: "Invalid request body"
    });
  }

  // if no completions, return empty array
  if (completions.length === 0) {
    return res.json({ topUsers: [] });
  }

  // filter out the first 3 users who completed the quiz correctly
  const topUsers = completions
    .filter((entry) => entry.correct)
    .sort((a, b) => new Date(a.completionDate) - new Date(b.completionDate))
    .slice(0, 3);

  // for each user, generate a reward image
  /** @type {TopUser[]} */
  const topUsersWithImages = await Promise.all(
    topUsers.map(async (user) => {
      try {
        user.rewardImage = await generateRewardImage({
          imageUrl: user.profilePicture,
          userDisplayName: user.displayName
        });

        return user;

      } catch (error) {
        console.error(`Failed to generate image for ${user.displayName}:`, error);

        return {
          ...user,
          rewardImage: null
        };
      }
  }));

  return res.status(200).json({
    topUsersWithImages
  });
}
