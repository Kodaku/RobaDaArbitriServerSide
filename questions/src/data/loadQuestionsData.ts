import { QuestionAttrs } from "../models/question";
import { Question } from "../models/question";

export const loadQuestionData = async (questions: QuestionAttrs[]) => {
    for(let i = 0; i < questions.length; i++) {
        const question: QuestionAttrs = questions[i];
        console.log(`Loading question ${question.questionText}`);
        const questionToSave = Question.build({
            questionId: question.questionId,
            questionText: question.questionText,
            questionCategory: question.questionCategory,
            wrongOptions: question.wrongOptions,
            correctOptions: question.correctOptions
        });

        await questionToSave.save();
    }
}