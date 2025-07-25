import axios from 'axios'; //pentru ollama
import fs from 'fs/promises'; //pentru json
import prompts from '../../prompts.js';
import moment from 'moment';

const ACCEPTED_QUIZ_TYPES = ['historical', 'funny', 'photo', 'caption', 'emoji_puzzle'];

export class QuizController {
  static async handleQuizRequest(req, res) {
    const type = req.query.type;

    if (!type) return res.status(400).json({ error: 'Missing quiz type' });

    if (!ACCEPTED_QUIZ_TYPES.includes(type)) {
      return res.status(400).json({ error: 'Invalid quiz type' });
    }

    try { //luam tipul din prompts.js
      let prompt = prompts[type];
      
      //asta ii pentru ca la historical trebuie sa schimbam data
      if (type === 'historical') {
        const currentDate = moment().format('LL')
        prompt = prompt.replace('{{currentDate}}', currentDate);
      }

      //request la ollama cu intrebarile
      const response = await axios.post(
        'http://ollama.vsp.dev/api/generate',
        {
          model: 'llama3.1:latest',
          prompt: prompt,
          stream: false
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OLLAMA_API_KEY}`
        }
         }
      );

      const quizResponse = response.data.response;

      let quizJSON;

      try {
        quizJSON = JSON.parse(quizResponse);
      } catch (err) {
        quizJSON = quizResponse.toString();
      }

      res.status(200).json({
        quiz: quizJSON,
        type: type
      });

    } catch (err) {
      //alte erori
      res.status(500).json({ error: 'Internal server error', details: err.message });
    }
  }
}

