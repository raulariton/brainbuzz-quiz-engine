import express from 'express';
import testRoute from './routes/testRoute.js';

const app = express();
const port = 3000;

app.use(express.json());
app.use('/', testRoute);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
