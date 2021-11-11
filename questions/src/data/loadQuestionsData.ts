import { QuestionCreatedPublisher } from "../events/publishers/question-created-publisher";
import { QuestionAttrs } from "../models/question";
import { Question } from "../models/question";
import { natsWrapper } from "../nats-wrapper";

export const loadQuestionData = async (questions: QuestionAttrs[]) => {
    for(let i = 0; i < questions.length; i++) {
        const question: QuestionAttrs = questions[i];
        // console.log(`Loading question ${question.questionText}`);
        var query = Question.find({});
        var resp = await query.where('questionId').equals(question.questionId).exec();
        if(resp[0])
        {
            console.log("This data is already in the DB");
            continue;
        }
        const questionToSave = Question.build({
            questionId: question.questionId,
            questionText: question.questionText,
            questionCategory: question.questionCategory.replace(/\s/g, "").toLowerCase(),
            wrongOptions: question.wrongOptions,
            correctOptions: question.correctOptions
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
            correctOptions: questionToSave.correctOptions
        });
    }
}