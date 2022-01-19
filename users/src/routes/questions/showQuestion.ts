import { Router, Request, Response } from "express";
import { Question } from "../../models/question";

const router = Router();

router.get(
    "/api/questions/:questionId",
    async (req: Request, res: Response) => {
        const questionId = req.params.questionId;

        const question = await Question.find({})
            .where("questionId")
            .equals(questionId)
            .exec();

        if (!question[0]) {
            throw new Error("Question Not found");
        }

        res.status(201).send(question);
    }
);

export { router as getQuestionRouter };
