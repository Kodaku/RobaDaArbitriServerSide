import fs from 'fs';
import { QuestionAttrs } from '../models/question';

const questions: QuestionAttrs[] = JSON.parse(fs.readFileSync(`${__dirname}/questions.json`, "utf-8"));

export { questions };