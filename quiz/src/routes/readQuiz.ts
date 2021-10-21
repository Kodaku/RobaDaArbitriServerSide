import { Router, Request, Response } from 'express';
import { Quiz } from '../models/quiz';

const router = Router();

router.get("/api/quiz/quiz", (req: Request, res: Response) => {
    res.send("Hi there");
})

router.get("/api/quiz", async (req: Request, res: Response) => {
    const quizzes = await Quiz.find();

    res.status(200).send(quizzes);
});

export { router as readQuizRouter };