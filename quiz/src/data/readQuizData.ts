import fs from 'fs';
import { QuizAttrs } from '../models/quiz';

const questions: QuizAttrs[] = JSON.parse(fs.readFileSync(`${__dirname}/quiz.json`, "utf-8"));

export { questions };