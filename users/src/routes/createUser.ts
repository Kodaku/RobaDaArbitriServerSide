import { Router, Request, Response } from "express";
import { UserCreatedPublisher } from "../events/user-created-publisher";
import { User } from "../models/user";
import { natsWrapper } from "../nats-wrapper";

const router = Router();

router.post("/api/users", async (req: Request, res: Response) => {
    const { userName, email } = req.body;

    const user = User.build({
        userName,
        email,
        executedQuestionIds: [],
        executedQuizIds: []
    });

    await user.save();

    new UserCreatedPublisher(natsWrapper.client).publish({
        id: user.id,
        version: user.version,
        userName: user.userName,
        email: user.email,
        executedQuestionIds: user.executedQuestionIds,
        executedQuizIds: user.executedQuizIds,
    });

    res.status(201).send(user);
});

export { router as createUserRouter };