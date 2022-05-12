import { Router, Request, Response } from "express";
import { users } from "../../data/readUsersData";
import { User } from "../../models/user";
import { UserType } from "../../types";

const router = Router();

/*
    This route is used to create some fake users by reading the array called users
*/
router.get("/api/users/create", async (req: Request, res: Response) => {
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
            firebaseId: "",
            userName: user.userName,
            email: user.email,
            executedQuestionIds: user.executedQuestionIds,
            notExecutedQuizIds: user.notExecutedQuizIds,
            executedQuizzes: user.executedQuizzes,
            wrongQuestions: user.wrongQuestions,
        });

        console.log(userToSave);

        await userToSave.save();

        usersLoaded.push(userToSave);
    }

    res.status(200).send(usersLoaded);
});

/*This route is used to create a single user from a post request so make sure to pass to the post request the data in the req.body object destructuring*/
router.post("/api/users/add", async (req: Request, res: Response) => {
    const { firebaseId, userName, email } = req.body;
    const user = User.build({
        firebaseId,
        userName,
        email,
        executedQuestionIds: [],
        notExecutedQuizIds: [],
        executedQuizzes: [],
        wrongQuestions: [],
    });
    await user.save();

    res.status(201).json({
        user: user,
    });
});

export { router as createUserRouter };
