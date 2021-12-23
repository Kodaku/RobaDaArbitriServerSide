import { QuestionCreatedPublisher } from "../events/publishers/question-created-publisher";
import { Question } from "../models/question";
import { natsWrapper } from "../nats-wrapper";
import { QuestionType } from "../types";

export const loadQuestionData = async (questions: QuestionType[]) => {
    for (let i = 0; i < questions.length; i++) {
        const question: QuestionType = questions[i];
        // console.log(`Loading question ${question.questionText}`);
        var query = Question.find({});
        var resp = await query
            .where("questionId")
            .equals(question.questionId)
            .exec();
        if (resp[0]) {
            console.log("This data is already in the DB");
            continue;
        }
        const questionToSave = Question.build({
            questionId: question.questionId,
            questionText: question.questionText,
            questionCategory: question.questionCategory
                .replace(/\s/g, "")
                .toLowerCase(),
            wrongOptions: question.wrongAnswers,
            correctOptions: question.correctAnswers,
            questionOptions: question.questionOptions,
        });

        await questionToSave.save();

        //TODO: Publish the event about having created a question
        new QuestionCreatedPublisher(natsWrapper.client).publish({
            id: questionToSave.id,
            version: questionToSave.version,
            questionId: questionToSave.questionId,
            questionText: questionToSave.questionText,
            questionCategory: questionToSave.questionCategory,
            wrongOptions: questionToSave.wrongOptions,
            correctOptions: questionToSave.correctOptions,
            questionOptions: questionToSave.questionOptions,
        });
    }
};
