import { Router, Request, Response } from "express";
import { Quiz, QuizDoc } from "../models/quiz";
import { User } from "../models/user";

const router = Router();

router.get("/api/users", async (req: Request, res: Response) => {
    const users = await User.find({});

    res.status(200).send(users);
});

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
