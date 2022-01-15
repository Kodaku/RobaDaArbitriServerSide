import express from "express";
import cors from "cors";
import { json } from "body-parser";
import { createQuizRouter } from "./routes/createQuiz";
import { updateQuizRouter } from "./routes/updateQuiz";
import { showQuizRouter } from "./routes/showQuiz";

const app = express();
app.use(json());
app.use(cors());

app.use(createQuizRouter);
app.use(updateQuizRouter);
app.use(showQuizRouter);

app.all("*", async (req, res) => {
    res.status(404).send("ROUTE NOT FOUND");
});

export { app };
