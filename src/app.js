import express from 'express';
import dotenv from 'dotenv';
import resultsRoute from './routes/resultRoute.js'
import quizRoute from './routes/quizRoute.js';
import userAnswerRoute from './routes/userAnswerRoute.js';

//codu asta exista pentru a incarca variabilele din fisierul .env din root folder
dotenv.config({ quiet: true });

const app = express();
const port = 3001;

app.use(express.json());

app.use('/quiz', quizRoute);
app.use('/results', resultsRoute);
app.use('/answers', userAnswerRoute);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
