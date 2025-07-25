import express from 'express';
import dotenv from 'dotenv';
import resultsRoute from './routes/resultRoute.js'
import { QuizController } from './controllers/quizController.js';

//codu asta exista pentru a incarca variabilele din fisierul .env din root folder
dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());
app.use('/', resultsRoute);
app.use('/quiz', QuizController.handleQuizRequest);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
