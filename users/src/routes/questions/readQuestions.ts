import { Router, Request, Response } from 'express';
import { Question } from '../../models/question';

const router = Router();

router.get('/api/questions/test', (req: Request, res: Response) => {
    res.send('Hi There!');
});

router.get("/api/questions", async (req: Request, res: Response) => {
    const questions = await Question.find();

    res.status(200).send(questions);
});

export { router as readQuestionRouter };