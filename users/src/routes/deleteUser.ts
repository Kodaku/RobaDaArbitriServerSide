import { Request, Response, Router } from "express";
import { UserDeletedPublisher } from "../events/publishers/user-deleted-publisher";
import { User } from "../models/user";
import { natsWrapper } from "../nats-wrapper";

const router = Router();

router.get("/api/users/delete/:userId", async (req: Request, res: Response) => {
    const userId = req.params.userId;

    const result = await User.findByIdAndDelete(userId);
    // console.log(result);

    if (!result) {
        throw new Error("Error while deleting the question");
    }

    new UserDeletedPublisher(natsWrapper.client).publish({
        id: result.id,
        firebaseId: result.firebaseId,
        version: result.version,
        userName: result.userName,
        email: result.email,
        executedQuestionIds: result.executedQuestionIds,
        notExecutedQuizIds: result.notExecutedQuizIds,
        executedQuizzes: result.executedQuizzes,
        wrongQuestions: result.wrongQuestions,
    });

    res.status(200).send(result);
});

export { router as deleteUserRouter };
