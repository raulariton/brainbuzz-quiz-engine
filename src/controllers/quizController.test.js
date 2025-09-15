import { QuizController } from './quizController.js';
import { generateQuiz } from '../services/quizServices.js';
import quizTypes from '../quizTypes.js';
import { getActiveQuiz, storeQuiz } from '../services/dbServices.js';

const activeQuiz = {
  quiz_id: '123',
  quiz: {
    quizText: 'What is the capital of France?',
    options: ['Paris', 'London', 'Berlin'],
    answer: 'Paris'
  },
  answers: 0,
  is_active: true,
  type: 'historical',
  start_time: new Date() - 1000 * 60, // started 1 minute ago
}

// mock the database service
jest.mock('../services/dbServices.js', () => ({
  getActiveQuiz: jest.fn(),
  storeQuiz: jest.fn(),
}));

// mock the quiz service
jest.mock('../services/quizServices.js', () => ({
  generateQuiz: jest.fn(),
}));

// mock axios
jest.mock('axios')



describe('GET /quiz', () => {
  let req, res;
  const mockQuizID = 'r4nd0m-qV12-1d';

  describe('returns', () => {

    beforeEach(() => {
      req = {}
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
    })

    test('error 400 if quiz type is missing', async () => {
      req.query = {};

      await QuizController.handleQuizRequest(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Missing quiz type' });
    })

    test('error 400 if quiz type is invalid', async () => {
      req.query = { type: 'anInvalidType' };

      await QuizController.handleQuizRequest(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid quiz type' });
    })

    test(
      'an active quiz if one with the same type exists in the database',
      async () => {
        req.query = { type: 'historical', duration: 60 };

        getActiveQuiz.mockResolvedValue(activeQuiz);

        await QuizController.handleQuizRequest(req, res);

        expect(res.json).toHaveBeenCalledWith({
          quiz_id: activeQuiz.quiz_id,
          quizText: activeQuiz.quiz.quizText,
          options: activeQuiz.quiz.options,
          answer: activeQuiz.quiz.answer
        })
      }
    )

    test('error 500 if quiz generation fails', async () => {
      req.query = { type: 'historical', duration: 60 };

      // mock the dbService to return no active quiz
      getActiveQuiz.mockResolvedValue(null);

      // mock the quiz generation service to return null
      //  indicating failure
      generateQuiz.mockResolvedValue(null);

      await QuizController.handleQuizRequest(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to generate quiz' });
    })

    test('error 500 if storing quiz fails', async () => {
      req.query = { type: 'historical', duration: 60 };

      // mock the dbService to return no active quiz
      getActiveQuiz.mockResolvedValue(null);

      // mock the quiz generation service
      const mockQuiz = {
        quizText: 'In what year was the YouTube website launched?',
        options: ['2006', '2005', '2008'],
        answer: '2005'
      }
      generateQuiz.mockResolvedValue(mockQuiz);

      // mock the quiz generation service to return null
      //  indicating failure
      storeQuiz.mockRejectedValue(new Error('Failed to store quiz'));

      await QuizController.handleQuizRequest(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to store quiz' });
    })

    test('a new quiz if no active quiz exists', async () => {
      req.query = { type: 'historical', duration: 60 };

      // mock the dbService to return no active quiz
      getActiveQuiz.mockResolvedValue(null);

      // mock the quiz generation service
      const mockQuiz = {
        quizText: 'In what year was the YouTube website launched?',
        options: ['2006', '2005', '2008'],
        answer: '2005'
      }
      generateQuiz.mockResolvedValue(mockQuiz);

      // mock the storeQuiz method
      //  to simulate storing the quiz in the database
      //  and returning a new quiz_id that the controller needs
      storeQuiz.mockResolvedValue(mockQuizID);

      await QuizController.handleQuizRequest(req, res);

      expect(res.json).toHaveBeenCalledWith({
        quiz_id: mockQuizID,
        quizText: mockQuiz.quizText,
        options: mockQuiz.options,
        answer: mockQuiz.answer,
      });
    })
  })

})