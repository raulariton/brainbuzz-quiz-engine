import { UserAnswerController } from './userAnswerController.js';
import { storeUserAnswer } from '../services/dbServices.js';
import { faker } from '@faker-js/faker';

// mock the dbServices module
jest.mock('../services/dbServices.js', () => ({
  storeUserAnswer: jest.fn()
}));

describe('POST /answers', () => {
  const req = {};
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns 400 if quiz_id is missing from request body', async () => {
    req.body = {};

    await UserAnswerController.handleAnswerSubmission(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Missing or invalid fields' });
  });

  test('returns 400 if user_id is missing from request body', async () => {
    req.body = { quizId: 'some-quiz-id' };

    await UserAnswerController.handleAnswerSubmission(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Missing or invalid fields' });
  });

  test('returns 400 if correct is missing from request body', async () => {
    req.body = { quizId: 'some-quiz-id', userId: 'user123' };

    await UserAnswerController.handleAnswerSubmission(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Missing or invalid fields' });
  });

  test('returns 400 if user_data is missing from request body', async () => {
    req.body = { quizId: 'some-quiz-id', userId: 'user123', correct: true };

    await UserAnswerController.handleAnswerSubmission(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Missing or invalid fields' });
  });

  test('returns 500 if there is an error storing the user answer', async () => {
    req.body = {
      user_id: faker.string.uuid(),
      quiz_id: faker.string.uuid(),
      correct: faker.datatype.boolean(),
      user_data:
        {
          display_name: faker.person.fullName(),
          profile_picture_url: faker.image.url()
        }
    }

    // Mock the database service to simulate an error
    const errorMessage = 'Database error';
    storeUserAnswer.mockRejectedValue(new Error(errorMessage));

    await UserAnswerController.handleAnswerSubmission(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to save answer', details: errorMessage });

  });

  test('returns 201 and stores user answer successfully', async () => {
    req.body = {
      user_id: faker.string.uuid(),
      quiz_id: faker.string.uuid(),
      correct: faker.datatype.boolean(),
      user_data:
        {
          display_name: faker.person.fullName(),
          profile_picture_url: faker.image.url()
        }
    }

    // Mock the database service to simulate storing the answer
    const userAnswerId = faker.string.uuid();
    const totalAnswersAfterUpdate = faker.number.int({ min: 1, max: 10 });
    storeUserAnswer.mockResolvedValue({
      user_answer_id: userAnswerId,
      updated_answers: totalAnswersAfterUpdate
    });

    await UserAnswerController.handleAnswerSubmission(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Answer saved',
      user_answer_id: userAnswerId,
      total_answers: totalAnswersAfterUpdate
    });
  });
})