import mongoose from 'mongoose';
import fs from 'fs';
import { Quiz } from './models/quiz';

if(!process.env.DATABASE) {
    throw new Error("Database variable not defined");
}

if(!process.env.DB_PASSWORD) {
    throw new Error("Database password not defined")
}

try {
    const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DB_PASSWORD);
    mongoose.connect(DB, () => {
        console.log("Connceted to the QUIZ database!");
    });
} catch (err) {
    console.log(err);
}

const questions = JSON.parse(fs.readFileSync("./data/quiz.json", "utf-8"));

const importData = async () => {
    try {
        await Quiz.create(questions);
        console.log("Data successfully loaded");
        process.exit();
    } catch (err) {
        console.log(err);
    }
};

const deleteData = async () => {
    try {
        await Quiz.deleteMany({});
        console.log("Data successfully deleted");
    } catch (err) {
        console.log(err);
    }
};

importData();