import express from 'express';
import mongoose from 'mongoose';
import { json } from 'body-parser';
import { readQuizRouter } from './routes/readQuiz';
import { createQuizRouter } from './routes/createQuiz';
import { questions } from './data/readQuizData';
import { loadQuizData } from './data/loadQuizData';

// console.log(questions);

const app = express();
app.use(json());

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
        
        await loadQuizData(questions);
        console.log("Initial Data successfully loaded");
    });

    // for(let i = 0; i < questions.length; i++) {
    //     console.log(questions[i]);
    // }
} catch (err) {
    console.log(err);
}

app.use(readQuizRouter);
app.use(createQuizRouter);

app.listen(5000, () => {
    console.log("Listening on port 5000");
});