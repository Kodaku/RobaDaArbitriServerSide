import { Router, Request, Response } from "express";
import { users } from "../data/readUsersData";
import { UserCreatedPublisher } from "../events/publishers/user-created-publisher";
import { User } from "../models/user";
import { natsWrapper } from "../nats-wrapper";
import { UserType } from "../types";

const router = Router();

router.get("/api/users/create", async (req: Request, res: Response) => {
    // const { userName, email } = req.body;

    // const user = User.build({
    //     userName,
    //     email,
    //     executedQuestionIds: [],
    //     executedQuizIds: [],
    // });

    // await user.save();

    // new UserCreatedPublisher(natsWrapper.client).publish({
    //     id: user.id,
    //     version: user.version,
    //     userName: user.userName,
    //     email: user.email,
    //     executedQuestionIds: user.executedQuestionIds,
    //     executedQuizIds: user.executedQuizIds,
    // });

    // res.status(201).send(user);
    const usersLoaded = [];
    for (let i = 0; i < users.length; i++) {
        const user: UserType = users[i];
        // console.log(`Loading user ${user.questionText}`);
        var query = User.find({});
        var resp = await query.where("userName").equals(user.userName).exec();
        if (resp[0]) {
            console.log("This data is already in the DB");
            continue;
        }
        const userToSave = User.build({
            userName: user.userName,
            email: user.email,
            executedQuestionIds: user.executedQuestionIds,
            executedQuizIds: user.executedQuizIds,
        });

        await userToSave.save();

        new UserCreatedPublisher(natsWrapper.client).publish({
            id: userToSave.id,
            version: userToSave.version,
            userName: userToSave.userName,
            email: userToSave.email,
            executedQuestionIds: userToSave.executedQuestionIds,
            executedQuizIds: userToSave.executedQuizIds,
        });
        usersLoaded.push(userToSave);
    }

    res.status(200).send(usersLoaded);
});

export { router as createUserRouter };
