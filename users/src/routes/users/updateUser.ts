import { Router, Request, Response } from "express";
import { User } from "../../models/user";

const router = Router();

/** Updating the user with a given id
Make sure to pass all the data as shown in the req.body descruturing when using the post request */
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

    res.status(200).send(user);
});

export { router as updateUserRouter };
