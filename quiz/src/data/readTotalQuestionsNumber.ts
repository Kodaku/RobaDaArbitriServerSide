import fs from 'fs';

const questionsNumber: number = parseInt(fs.readFileSync(`${__dirname}/totalQuestions.txt`, "utf-8"));
const allQuestionsIds: number[] = [];
for (let i = 1; i <= questionsNumber; i++) {
    allQuestionsIds.push(i);
}

export { questionsNumber, allQuestionsIds };