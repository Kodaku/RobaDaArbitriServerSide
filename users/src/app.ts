import express from "express";
import cors from "cors";
import { json } from "body-parser";
import { createUserRouter } from "./routes/users/createUser";
import { showUserRouter } from "./routes/users/showUser";
import { updateUserRouter } from "./routes/users/updateUser";
import { deleteUserRouter } from "./routes/users/deleteUser";
import { createQuestionRouter } from "./routes/questions/createQuestions";
import { updateQuestionRouter } from "./routes/questions/updateQuestions";
import { deleteQuestionRouter } from "./routes/questions/deleteQuestion";
import { readQuestionRouter } from "./routes/questions/readQuestions";
import { getQuestionRouter } from "./routes/questions/showQuestion";
import { createQuizRouter } from "./routes/quiz/createQuiz";
import { showQuizRouter } from "./routes/quiz/showQuiz";
import { updateQuizRouter } from "./routes/quiz/updateQuiz";
import { deleteQuizRouter } from "./routes/quiz/deleteQuiz";

const app = express();
app.use(json());
app.use(cors());

app.use(createUserRouter);
app.use(showUserRouter);
app.use(updateUserRouter);
app.use(deleteUserRouter);

//Questions
app.use(createQuestionRouter);
app.use(updateQuestionRouter);
app.use(deleteQuestionRouter);
app.use(readQuestionRouter);
app.use(getQuestionRouter);

//Quiz
app.use(createQuizRouter);
app.use(showQuizRouter);
app.use(updateQuizRouter);
app.use(deleteQuizRouter);

app.all("*", async (req, res) => {
    res.status(404).send("ROUTE NOT FOUND");
});

export { app };
