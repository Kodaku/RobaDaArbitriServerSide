import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { json } from 'body-parser';
import { readQuizRouter } from './routes/readQuestions';
import { createQuizRouter } from './routes/createQuestions';
import { questions } from './data/readQuestionsData';
import { loadQuestionData } from './data/loadQuestionsData';

// console.log(questions);

const app = express();
app.use(json());
app.use(cors());

// if(!process.env.DATABASE) {
//     throw new Error("Database variable not defined");
// }

// if(!process.env.DB_PASSWORD) {
//     throw new Error("Database password not defined")
// }
if(!process.env.QUIZ_MONGO_URI) {
    throw new Error("Quiz Database not defined");
}

try {
    // const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DB_PASSWORD);
    mongoose.connect(process.env.QUIZ_MONGO_URI, async () => {
        console.log("Connceted to the QUIZ database!");
        
        await loadQuestionData(questions);
        console.log("Initial Data successfully loaded");
    });

} catch (err) {
    console.log(err);
}

app.use(readQuizRouter);
app.use(createQuizRouter);

app.listen(5000, () => {
    console.log("Listening on port 5000");
});