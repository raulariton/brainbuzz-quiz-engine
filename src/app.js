import express from 'express';
<<<<<<< HEAD
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch'; // npm install node-fetch

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
=======
import dotenv from 'dotenv';
//import testRoute from './routes/testRoute.js';
import { QuizController } from './controllers/quizController.js';

//codu asta exista pentru a incarca variabilele din fisierul .env din root folder
dotenv.config();
>>>>>>> d59742c6652fe68af6cfeb28b2bfc9d37e983b4b

const app = express();
const PORT = 3000;

<<<<<<< HEAD
// Load prompts.json
const promptsPath = path.join(__dirname, 'prompts.json');
const prompts = JSON.parse(fs.readFileSync(promptsPath, 'utf-8'));

// Ollama config
const OLLAMA_URL = 'https://ollama.vsp.dev/api/generate';
const OLLAMA_MODEL = 'llama3.1:latest';
const OLLAMA_TOKEN = 'GU9JQNhjO19DbRyNFGOGd765LS07boBq1VdKSeQWuao1GphM0R1gjuEwxzPWq6v0sDRxKdZ5RtRwDnThCj7DuFVkyMgejcz04kVsYWNi1tDGliXx2pTXYzgj5Qv2oAzr';

// GET /quiz?type=historical
app.get('/quiz', async (req, res) => {
  const quizType = req.query.type;

  if (!quizType || !prompts[quizType]) {
    return res.status(400).json({ error: 'Invalid or missing quiz type' });
  }

  const currentDate = new Date().toLocaleDateString('en-US');
  const prompt = prompts[quizType].replace('{{CURRENT_DATE}}', currentDate);

  try {
    const aiResponse = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OLLAMA_TOKEN}`,
      },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt: prompt,
        stream: false,
      }),
    });

    const result = await aiResponse.json();
    console.log('Răspuns complet de la Ollama:', result);
    const match = result.response.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('No valid JSON object found in response');

    const quiz = JSON.parse(match[0]);
    res.json(quiz);

    res.json(quiz);

  } catch (error) {
    console.error('Error generating quiz:', error.message);
    res.status(500).json({ error: 'Failed to generate quiz' });
  }
});

app.listen(PORT, () => {
  console.log(`Quiz engine is running on http://localhost:${PORT}`);
=======
app.use(express.json());

//app.use('/', testRoute);
app.use('/quiz', QuizController.handleQuizRequest);

app.listen(port, () => {
  console.log(`Primul test on ${port}`);
>>>>>>> d59742c6652fe68af6cfeb28b2bfc9d37e983b4b
});
