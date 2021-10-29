import { Request, Response, Router } from 'express';
import { Question } from '../models/question';

const router = Router();

router.post("/api/questions", async (req: Request, res: Response) => {
    const { questionId, questionText, questionCategory, wrongOptions, correctOptions } = req.body;

    const quiz = Question.build({
        questionId,
        questionText,
        questionCategory,
        wrongOptions,
        correctOptions
    });

    await quiz.save();


    res.status(201).send(quiz);
});

export { router as createQuizRouter };