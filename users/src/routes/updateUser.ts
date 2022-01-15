import { Router, Request, Response } from "express";
import { UserUpdatedPublisher } from "../events/publishers/user-updated-publisher";
import { User } from "../models/user";
import { natsWrapper } from "../nats-wrapper";

const router = Router();

router.post("/api/users/:id", async (req: Request, res: Response) => {
    const id = req.params.id;
    const { userName, email, executedQuestionIds, notExecutedQuizIds } =
        req.body;
    const executedQuizzes = req.body.executedQuizzes;
    const wrongQuestions = req.body.wrongQuestions;

    const user = await User.findById(id);

    if (!user) {
        throw new Error("User Not Found");
    }

    user.set({
        userName,
        email,
        executedQuestionIds,
        notExecutedQuizIds,
        executedQuizzes,
        wrongQuestions,
    });

    await user.save();

    new UserUpdatedPublisher(natsWrapper.client).publish({
        id: user.id,
        firebaseId: user.firebaseId,
        version: user.version,
        userName: userName,
        email: email,
        executedQuestionIds: executedQuestionIds,
        notExecutedQuizIds: notExecutedQuizIds,
        executedQuizzes: executedQuizzes,
        wrongQuestions: wrongQuestions,
    });

    res.status(200).send(user);
});

export { router as updateUserRouter };
