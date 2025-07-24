import express from 'express';
import dotenv from 'dotenv';
//import testRoute from './routes/testRoute.js';
import { QuizController } from './controllers/quizController.js';

//codu asta exista pentru a incarca variabilele din fisierul .env din root folder
dotenv.config({ path: '../.env' });

const app = express();
const port = 3000;

app.use(express.json());
//app.use('/', testRoute);
app.use('/quiz', QuizController.handleQuizRequest);

app.listen(port, () => {
  console.log(`Primul test on ${port}`);
});
