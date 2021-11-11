import fs from 'fs';

const questionsNumber: number = parseInt(fs.readFileSync(`${__dirname}/totalQuestions.txt`, "utf-8"));

export { questionsNumber };