import { Request, Response, Router } from "express";
import { Quiz } from "../../models/quiz";

const router = Router();

/** Get a quiz with the quizId ID */
router.get("/api/quiz/:quizId", async (req: Request, res: Response) => {
    const quizId = req.params.quizId;

    const quiz = await Quiz.findById(quizId).populate("quizQuestions");

    if (!quiz) {
        throw new Error("Quiz Not Found");
    }

    res.status(200).json({
        quiz: quiz,
        questions: quiz.quizQuestions,
    });
});

export { router as showQuizRouter };
