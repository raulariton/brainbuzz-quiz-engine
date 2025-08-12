import { ResultsController } from './resultsController.js';
import moment from 'moment';
import { faker } from '@faker-js/faker';
import { generateRewardImage } from '../services/imageGenerationServices.js';
import { getQuizCorrectCompletions } from '../services/dbServices.js';

/**
 * @typedef {Object} UserData
 * @property {string} display_name - user's display name
 * @property {string} profile_picture_url - URL to user's profile picture
 */

/**
 * @typedef {Object} Completion
 * @property {string} user_id - user ID
 * @property {UserData} user_data - user's display name
 * @property {boolean} correct - whether the user answered correctly
 * @property {string} completion_date - ISO date string of when the user completed the quiz
 */

// NOTE: since we don't store quiz timeout timestamp or duration
//  we will use a hardcoded 60 seconds for quiz duration
const QUIZ_DURATION = 60 * 1000; // 60 seconds in milliseconds

// mock the database service
jest.mock('../services/dbServices.js', () => ({
  getQuizCorrectCompletions: jest.fn(),
}));

// mock the image generation service
jest.mock('../services/imageGenerationServices.js', () => ({
  generateRewardImage: jest.fn()
}));

/**
 * Generates a correct user completion entry using the specified quiz start timestamp and duration.
 * @return {Completion} - A completion object representing a user who answered correctly.
 */
function generateUserCompletion(quizStartTimestamp, quizDuration) {
  const userId = faker.string.uuid();
  const displayName = faker.person.fullName();
  const profilePicture = faker.image.url();

  // Generate completion time
  // The completion time is a random time between 5 seconds since quiz start and quizDuration - 5 seconds
  const millisecondsForCompletionFromStart = faker.number.int({
    min: 5 * 1000,
    max: quizDuration - 5 * 1000
  });
  const completionDate = moment(quizStartTimestamp).add(
    millisecondsForCompletionFromStart,
    'milliseconds'
  );

  return {
    user_id: userId,
    user_data: {
      display_name: displayName,
      profile_picture_url: profilePicture
    },
    correct: true,
    // controller expects ISO date string
    completion_date: completionDate.toISOString()
  };
}

describe('POST /results', () => {
  const req = {}
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };

  test('returns 400 if quiz_id is missing from request body', async () => {
    req.body = {};

    await ResultsController.handleResults(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid request body. Missing 'quizId'." });
  });

  test('returns empty array if no completions are found', async () => {
    req.body = { quizId: 'some-quiz-id' };

    getQuizCorrectCompletions.mockResolvedValue([]); // mock no completions found

    await ResultsController.handleResults(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ topUsers: [] });
  })

  describe('when completions are found', () => {
    test('returns top 3 users and other users who completed the quiz correctly', async () => {
      /** @type {Completion[]} */
      const correctCompletions = []
      const quizStartTimestamp = moment().subtract(2, 'minutes').toISOString();
      const numOfCorrectCompletions = faker.number.int({ min: 3, max: 10 });

      for (let i = 0; i < numOfCorrectCompletions; i++) {
        const userCompletion = generateUserCompletion(quizStartTimestamp, QUIZ_DURATION);
        correctCompletions.push(userCompletion);
      }

      const sortedCompletions = correctCompletions.sort(
        (a, b) => new Date(a.completion_date) - new Date(b.completion_date));

      getQuizCorrectCompletions.mockResolvedValue(correctCompletions);

      generateRewardImage.mockResolvedValue(faker.image.url());

      req.body = { quizId: 'some-quiz-id' };

      await ResultsController.handleResults(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        topUsersWithImages: sortedCompletions.slice(0, 3).map(user => ({
          ...user,
          rewardImage: expect.any(String) // assuming the image generation service is mocked
        })),
        otherUsersWithPlacement: sortedCompletions.slice(3).map((user, index) => ({
          ...user,
          placement: index + 4
        }))
      });
    })

    test('handles null completion dates gracefully', async () => {
      /** @type {Completion[]} */
      const correctCompletions = [];
      const quizStartTimestamp = moment().subtract(2, 'minutes').toISOString();
      const numOfCorrectCompletions = faker.number.int({ min: 3, max: 10 });

      for (let i = 0; i < numOfCorrectCompletions; i++) {
        const userCompletion = generateUserCompletion(quizStartTimestamp, QUIZ_DURATION);
        // randomly set some completion dates to null
        if (faker.datatype.boolean()) {
          userCompletion.completion_date = null;
        }
        correctCompletions.push(userCompletion);
      }

      const sortedCompletions = correctCompletions.sort((a, b) => {
        if (!a.completion_date) return 1;
        if (!b.completion_date) return -1;
        return new Date(a.completion_date) - new Date(b.completion_date)
      })

      getQuizCorrectCompletions.mockResolvedValue(correctCompletions);

      generateRewardImage.mockResolvedValue(faker.image.url());

      req.body = { quizId: 'some-quiz-id' };

      await ResultsController.handleResults(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        topUsersWithImages: sortedCompletions.slice(0, 3).map(user => ({
          ...user,
          rewardImage: expect.any(String)
        })),
        otherUsersWithPlacement: sortedCompletions.slice(3).map((user, index) => ({
          ...user,
          placement: index + 4
        }))
      });
    })
  })
})