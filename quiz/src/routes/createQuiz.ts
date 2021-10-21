import { Request, Response, Router } from 'express';
import { Quiz } from '../models/quiz';

const router = Router();

router.post("/api/quiz", async (req: Request, res: Response) => {
    const { quizId, questionId, questionText, wrongOptions, correctOptions } = req.body;

    const quiz = Quiz.build({
        quizId,
        questionId,
        questionText,
        wrongOptions,
        correctOptions
    });

    await quiz.save();


    res.status(201).send(quiz);
});

export { router as createQuizRouter };