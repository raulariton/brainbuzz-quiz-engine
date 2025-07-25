import axios from 'axios'; //pentru ollama
import fs from 'fs/promises'; //pentru json

export class QuizController {
  static async handleQuizRequest(req, res) {
    const type = req.query.type;
    if (!type) return res.status(400).json({ error: 'Missing quiz type' });

    try { //luam tipul din prompts.json
      const promptsData = await fs.readFile('../prompts.json', 'utf-8');
      const prompts = JSON.parse(promptsData);
      let prompt = prompts[type];
      
      //verificam daca exista un prompt pentru tipul cerut
      if (!prompt) return res.status(400).json({ error: 'Invalid quiz type' });
      
      //asta ii pentru ca la historical trebuie sa schimbam data
      if (type === 'historical') {
        const currentDate = new Date().toISOString().split('T')[0];
        prompt = prompt.replace('{{currentDate}}', currentDate);
      }
      //debug sa vad daca vede cheia
      console.log('OLLAMA_API_KEY:', process.env.OLLAMA_API_KEY);

      //request la ollama cu intrebarile
      const ollamaResponse = await axios.post(
        'http://ollama.vsp.dev/api/generate',
        {
          model: 'llama3.1:latest',
          prompt: prompt,
          stream: true
        },
        { responseType: 'stream',
          headers: {
            Authorization: process.env.OLLAMA_API_KEY
        }
         }
      );
      //asta ii textu full de la ollama
      let fullText = '';

      //aici se umple/completeaza textu full de la ollama (care vine in bucati)
      ollamaResponse.data.on('data', (chunk) => {
        const lines = chunk.toString().split('\n').filter(Boolean);
        for (const line of lines) {
          try {
            const parsed = JSON.parse(line);
            if (parsed.response) fullText += parsed.response;
          } catch (err) {
            console.error('JSON parse failed:', err);
          }
        }
      });
      //convert fulltext in json 
      //! nu merge cu promptul curent !
      ollamaResponse.data.on('end', () => {
        try {
          const quiz = JSON.parse(fullText);
          res.json(quiz);
        } catch (err) {
          res.status(500).json({ error: 'Failed to parse JSON', raw: fullText });
        }
      });
      //alte erori
    } catch (err) {
      res.status(500).json({ error: 'Internal server error', details: err.message });
    }
  }
}
