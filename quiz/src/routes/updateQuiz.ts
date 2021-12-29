import { Router, Request, Response } from "express";
import { Question } from "../models/question";
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
            const question = await Question.find({})
                .where("questionId")
                .equals(answer.questionId)
                .exec();
            if (question[0]) {
                question[0].set({ userAnswer: answer.userAnswer });
                await question[0].save();
            }
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
