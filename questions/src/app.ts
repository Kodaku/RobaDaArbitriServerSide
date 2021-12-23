import express from "express";
import cors from "cors";
import { json } from "body-parser";
import { readQuestionRouter } from "./routes/readQuestions";
import { createQuestionRouter } from "./routes/createQuestions";
import { updateQuestionRouter } from "./routes/updateQuestions";
import { deleteQuestionRouter } from "./routes/deleteQuestion";

const app = express();
app.use(json());
app.use(cors());

app.use(readQuestionRouter);
app.use(createQuestionRouter);
app.use(updateQuestionRouter);
app.use(deleteQuestionRouter);

app.all("*", async (req, res) => {
    res.status(404).send("ROUTE NOT FOUND");
});

export { app };
