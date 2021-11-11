import { Request, Response, Router } from 'express';
import { Question } from '../models/question';
import { QuestionCreatedPublisher } from '../events/publishers/question-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = Router();

router.post("/api/questions", async (req: Request, res: Response) => {
    const { questionId, questionText, questionCategory, wrongOptions, correctOptions } = req.body;

    const question = Question.build({
        questionId,
        questionText,
        questionCategory,
        wrongOptions,
        correctOptions
    });

    await question.save();
    new QuestionCreatedPublisher(natsWrapper.client).publish({
        id: question.id,
        version: question.version,
        questionId: question.questionId,
        questionText: question.questionText,
        questionCategory: question.questionCategory,
        wrongOptions: question.wrongOptions,
        correctOptions: question.correctOptions
    });


    res.status(201).send(question);
});

export { router as createQuestionRouter };