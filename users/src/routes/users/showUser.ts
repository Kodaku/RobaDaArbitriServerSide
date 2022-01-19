import { Router, Request, Response } from "express";
import { Quiz } from "../../models/quiz";
import { User } from "../../models/user";

const router = Router();

/**Get all the users */
router.get("/api/users", async (req: Request, res: Response) => {
    const users = await User.find({});

    res.status(200).send(users);
});

/** Get a particular user. Pay attention to the populate method calls.
The first time you see them is because they're used to populate the field of the user.
Then having all the user's quizzes we have to iterate through them and populate each of the field of each quiz */
router.get("/api/users/:id", async (req: Request, res: Response) => {
    const id = req.params.id;

    const user = await User.findById(id)
        .populate("wrongQuestions")
        .populate("executedQuizzes");

    // console.log(user);

    if (!user) {
        throw new Error("User Not Found");
    }

    const executedQuizzes = user.executedQuizzes;
    const quizzes = [];

    //Populating all the user's quizzes with the questions objects
    for (let i = 0; i < executedQuizzes.length; i++) {
        const quiz = await Quiz.findById(executedQuizzes[i].id)
            .populate("quizQuestions")
            .populate("wrongQuestions")
            .populate("correctQuestions");
        if (!quiz) {
            throw new Error("Quiz Not Found");
        }
        console.log(quiz);
        quizzes.push(quiz);
    }

    // console.log(executedQuizzes);
    // console.log(quizzes);

    res.status(200).json({ user, executedQuizzes: quizzes });
});

export { router as showUserRouter };
