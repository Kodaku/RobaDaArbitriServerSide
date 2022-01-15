import { Router, Request, Response } from "express";
import { QuizUpdatedPublisher } from "../events/publishers/quiz-updated-publisher";
import { Question } from "../models/question";
import { Quiz } from "../models/quiz";
import { natsWrapper } from "../nats-wrapper";
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

        let correctQuestions = quiz.correctQuestions;
        let wrongQuestions = quiz.wrongQuestions;
        let notAnsweredQuestions = quiz.notAnsweredQuestions;
        let userAnswers = quiz.userAnswers;

        const answers: Answer[] = req.body as Answer[];
        console.log(answers);

        for (let i = 0; i < answers.length; i++) {
            const answer = answers[i];
            const question = await Question.find({})
                .where("questionId")
                .equals(answer.questionId)
                .exec();
            // if (question[0]) {
            //     question[0].set({ userAnswer: answer.userAnswer });
            //     await question[0].save();
            // }
            if (answer.isCorrect && question[0]) {
                correctQuestions.push(question[0]);
            } else if (question[0]) {
                wrongQuestions.push(question[0]);
            }
            if (answer.userAnswer) {
                userAnswers.push(answer.userAnswer);
            } else {
                notAnsweredQuestions.push(question[0]);
            }
        }

        quiz.set({
            correctQuestionIds: correctQuestions,
            wrongQuestionsIds: wrongQuestions,
            notAnsweredQuestions: notAnsweredQuestions,
            userAnswers: userAnswers,
        });

        await quiz.save();

        // quiz.depopulate("wrongQuestions");

        const quizToSend = await Quiz.findById(quiz.id);

        if (!quizToSend) {
            return;
        }

        quizToSend.depopulate();

        new QuizUpdatedPublisher(natsWrapper.client).publish({
            id: quizToSend.id,
            version: quizToSend.version,
            ownerId: quizToSend.ownerId,
            wrongQuestions: quizToSend.wrongQuestions,
            correctQuestions: quizToSend.correctQuestions,
            notAnsweredQuestions: quizToSend.notAnsweredQuestions,
            quizQuestions: quizToSend.quizQuestions,
            userAnswers: quizToSend.userAnswers,
        });

        res.status(200).send(quiz);
    }
);

export { router as updateQuizRouter };
