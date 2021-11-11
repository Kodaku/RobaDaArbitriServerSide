import express from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import { createQuizRouter } from './routes/createQuiz';

const app = express();
app.use(json());
app.use(cors());

app.use(createQuizRouter);

app.all('*', async (req, res) => {
    res.status(404).send("ROUTE NOT FOUND");
});

export { app };