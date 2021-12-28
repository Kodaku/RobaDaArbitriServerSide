import { Router, Request, Response } from "express";
import { Quiz } from "../models/quiz";
import { Answer } from "../types";

const router = Router();

router.post(
    "/api/quiz/execute/:quizId",
    async (req: Request, res: Response) => {
        const quizId = req.params.quizId;

        // console.log(req.body);

        const quiz = await Quiz.findById(quizId);

        if (!quiz) {
            throw new Error("Quiz Not Found");
        }

        let correctQuestionsIds = quiz.correctQuestionsIds;
        let wrongQuestionsIds = quiz.wrongQuestionsIds;
        let userAnswers = quiz.userAnswers;

        const answers: Answer[] = req.body as Answer[];
        console.log(answers);

        for (let i = 0; i < answers.length; i++) {
            const answer = answers[i];
            if (answer.isCorrect) {
                correctQuestionsIds.push(answer.questionId);
            } else {
                wrongQuestionsIds.push(answer.questionId);
            }
            if (answer.userAnswer) {
                userAnswers.push(answer.userAnswer);
            } else {
                userAnswers.push("NotAnswered");
            }
        }

        quiz.set({
            correctQuestionIds: correctQuestionsIds,
            wrongQuestionsIds: wrongQuestionsIds,
            userAnswers: userAnswers,
        });

        await quiz.save();

        res.status(200).send(quiz);
    }
);

export { router as updateQuizRouter };
