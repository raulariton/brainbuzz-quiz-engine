import express from 'express';
import dotenv from 'dotenv';
import resultsRoute from './routes/resultRoute.js'
import quizRoute from './routes/quizRoute.js';
import userAnswerRoute from './routes/userAnswerRoute.js';
import { authenticateApiKey } from './middleware/authenticationMiddleware.js';
import quizTypesRoute from './routes/quizTypesRoute.js';

//codu asta exista pentru a incarca variabilele din fisierul .env din root folder
dotenv.config({ quiet: true });

const app = express();
const port = process.env.PORT

app.use(express.json());

app.use('/ping', (req, res) => {
  res.status(200).send('pong');
});

// use api key authentication middleware for all routes
app.use(authenticateApiKey);

app.use('/quiz', quizRoute);
app.use('/results', resultsRoute);
app.use('/answers', userAnswerRoute);
app.use('/quiz-types', quizTypesRoute);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
