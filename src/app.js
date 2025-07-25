import express from 'express';
import dotenv from 'dotenv';
import resultsRoute from './routes/resultRoute.js'
import quizRoute from './routes/quizRoute.js';

//codu asta exista pentru a incarca variabilele din fisierul .env din root folder
dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());

app.use('/quiz', quizRoute);
app.use('/results', resultsRoute);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
