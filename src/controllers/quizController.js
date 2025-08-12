import axios from 'axios'; //pentru ollama
import quizTypes from '../quizTypes.js';
import { getActiveQuiz, storeQuiz } from '../services/dbServices.js';
import { generateQuizImage } from '../services/imageGenerationServices.js';
import { generateQuiz } from '../services/quizServices.js';

const ACCEPTED_QUIZ_TYPES = Object.keys(quizTypes);

export class QuizController {
  static async handleQuizRequest(req, res) {
    const type = req.query.type;
    const duration = Number(req.query.duration) || 15; // default 15 seconds

    if (!type) return res.status(400).json({ error: 'Missing quiz type' });

    if (!ACCEPTED_QUIZ_TYPES.includes(type)) {
      return res.status(400).json({ error: 'Invalid quiz type' });
    }

    const active = await getActiveQuiz(type, duration);
    if (active) {
      return res.json({
        quiz_id: active.quiz_id,
        quizText: active.quiz.quizText,
        options: active.quiz.options,
        answer: active.quiz.answer
      });
    }

    const quiz = await generateQuiz(type);

    if (!quiz) {
      return res.status(500).json({ error: 'Failed to generate quiz' });
    }

    // generate quiz image
    let quizImageUrl;
    try {
      quizImageUrl = await generateQuizImage({
        imagePrompt: quizTypes[type].image_prompt
      })
    } catch (error) {
      return res.status(500).json({ error: 'Failed to generate quiz image' });
    }

    let quizId;
    try {
      quizId = await storeQuiz({ type, quiz, duration });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to store quiz' });
    }

    return res.json({
      quiz_id: quizId,
      quizText: quiz.quizText,
      options: quiz.options,
      answer: quiz.answer,
      imageUrl: quizImageUrl
    });
  }
}
