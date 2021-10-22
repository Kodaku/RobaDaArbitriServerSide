import { QuizAttrs } from "../models/quiz";
import { Quiz } from "../models/quiz";

export const loadQuizData = async (questions: QuizAttrs[]) => {
    for(let i = 0; i < questions.length; i++) {
        const question: QuizAttrs = questions[i];
        console.log(`Loading question ${question.questionText}`);
        const quiz = Quiz.build({
            quizId: question.quizId,
            questionId: question.questionId,
            questionText: question.questionText,
            wrongOptions: question.wrongOptions,
            correctOptions: question.correctOptions
        });

        await quiz.save();
    }
}