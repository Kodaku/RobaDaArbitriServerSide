import express from "express";
import cors from "cors";
import { json } from "body-parser";
import { createQuizRouter } from "./routes/createQuiz";
import { updateQuizRouter } from './routes/updateQuiz';

const app = express();
app.use(json());
app.use(cors());

app.use(createQuizRouter);
app.use(updateQuizRouter);

app.all("*", async (req, res) => {
    res.status(404).send("ROUTE NOT FOUND");
});

export { app };
