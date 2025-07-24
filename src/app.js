import express from 'express';
import testRoute from './routes/testRoute.js';
import resultsRoute from './routes/resultRoute.js'

const app = express();
const port = 3000;

app.use(express.json());

app.use('/', testRoute);
app.use('/', resultsRoute);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
