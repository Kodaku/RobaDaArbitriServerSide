import { Request, Response, Router } from "express";
import { QuestionDeletedublisher } from "../events/publishers/question-deleted-publisher";
import { Question } from "../models/question";
import { natsWrapper } from "../nats-wrapper";

const router = Router();

router.get(
    "/api/questions/delete/:questionId",
    async (req: Request, res: Response) => {
        const questionId = parseInt(req.params.questionId);

        const result = await Question.findOneAndDelete({
            questionId: questionId,
        });

        // console.log(result);

        if (!result) {
            throw new Error("Error while deleting the question");
        }

        new QuestionDeletedublisher(natsWrapper.client).publish({
            id: result.id,
            version: result.version,
            questionId: result.questionId,
            questionCategory: result.questionCategory,
            questionText: result.questionText,
            correctOptions: result.correctOptions,
            wrongOptions: result.wrongOptions,
            questionOptions: result.questionOptions,
            answerLink: result.answerLink,
        });

        res.status(200).send(result);
    }
);

export { router as deleteQuestionRouter };
