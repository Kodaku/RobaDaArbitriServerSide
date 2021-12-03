import { Router, Request, Response } from "express";
import { UserUpdatedPublisher } from "../events/publishers/user-updated-publisher";
import { User } from "../models/user";
import { natsWrapper } from "../nats-wrapper";

const router = Router();

router.post("/api/user/:id", async (req: Request, res: Response) => {
    const id = req.params.id;
    const { userName, email, executedQuestionIds, executedQuizIds } = req.body;

    const user = await User.findById(id);

    if (!user) {
        throw new Error("User Not Found");
    }

    user.set({
        userName,
        email,
        executedQuestionIds,
        executedQuizIds
    });

    await user.save();

    new UserUpdatedPublisher(natsWrapper.client).publish({
        id: user.id,
        version: user.version,
        userName: user.userName,
        email: user.email,
        executedQuestionIds: user.executedQuestionIds,
        executedQuizIds: user.executedQuizIds
    });

    res.status(200).send(user);
});

export { router as updateUserRouter };