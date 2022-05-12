import { Request, Response, Router } from "express";
import { Quiz } from "../../models/quiz";
import { User } from "../../models/user";

const router = Router();

router.get("/api/quiz/delete/:quizId", async (req: Request, res: Response) => {
    const quiz = await Quiz.findByIdAndDelete(req.params.quizId);

    if (!quiz) {
        throw new Error("Error while deleting the quiz");
    }

    const ownerId = quiz.ownerId;

    const user = await User.findById(ownerId);

    if (!user) {
        throw new Error("This user does not exist");
    }

    let userQuizzes = user.executedQuizzes;

    userQuizzes = userQuizzes.filter((userQuiz) => userQuiz.id !== quiz.id);

    console.log("Quiz successfully deleted");

    res.status(200).json({
        quiz: quiz,
        user: user,
    });
});

export { router as deleteQuizRouter };
