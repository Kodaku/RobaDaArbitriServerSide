import { Request, Response, Router } from "express";
import { Question } from "../models/question";
import { QuestionCreatedPublisher } from "../events/publishers/question-created-publisher";
import { natsWrapper } from "../nats-wrapper";
import { QuestionType } from "../types";
import { questions } from "../data/readQuestionsData";

const router = Router();

router.get("/api/questions/create", async (req: Request, res: Response) => {
    const questionsLoaded = [];
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
            answerLink: question.answerLink,
        });

        await questionToSave.save();

        new QuestionCreatedPublisher(natsWrapper.client).publish({
            id: questionToSave.id,
            version: questionToSave.version,
            questionId: questionToSave.questionId,
            questionText: questionToSave.questionText,
            questionCategory: questionToSave.questionCategory,
            wrongOptions: questionToSave.wrongOptions,
            correctOptions: questionToSave.correctOptions,
            questionOptions: questionToSave.questionOptions,
            answerLink: questionToSave.answerLink,
        });

        questionsLoaded.push(questionToSave);
    }

    res.status(200).send(questionsLoaded);
});

router.post("/api/questions/add", async (req: Request, res: Response) => {
    const {
        questionId,
        questionText,
        questionCategory,
        wrongOptions,
        correctOptions,
        questionOptions,
        answerLink,
    } = req.body;
    const question = Question.build({
        questionId,
        questionText,
        questionCategory,
        wrongOptions,
        correctOptions,
        questionOptions,
        answerLink,
    });
    await question.save();
    new QuestionCreatedPublisher(natsWrapper.client).publish({
        id: question.id,
        version: question.version,
        questionId: question.questionId,
        questionText: question.questionText,
        questionCategory: question.questionCategory,
        wrongOptions: question.wrongOptions,
        correctOptions: question.correctOptions,
        questionOptions: question.questionOptions,
        answerLink: question.answerLink,
    });
    res.status(201).send(question);
});

export { router as createQuestionRouter };
