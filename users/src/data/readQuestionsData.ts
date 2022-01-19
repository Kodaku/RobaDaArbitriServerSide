import fs from 'fs';
import { QuestionType } from '../types';

const questions: QuestionType[] = JSON.parse(fs.readFileSync(`${__dirname}/questions.json`, "utf-8"));

export { questions };