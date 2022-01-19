import { Router, Request, Response } from "express";
import { Question } from "../../models/question";
import { Quiz } from "../../models/quiz";
import { User } from "../../models/user";
import { Answer } from "../../types";

const router = Router();

/** Update a quiz after its execution
First we loop through the answers array checking for each answer if its correct or not
Using these informations we update the quiz
The we have also to update the user in order to keep track of the quiz he/she has executed and which questions he/she has failed
Also pay attention to the notExecutedQuizIds array of the user, it is used to keep track of the quizzes the user has interrupted or is doing. When the user has submitted the quiz the quizId is removed from this array */
router.post(
    "/api/quiz/execute/:quizId",
    async (req: Request, res: Response) => {
        const quizId = req.params.quizId;

        const quiz = await Quiz.findById(quizId);

        if (!quiz) {
            throw new Error("Quiz Not Found");
        }

        const user = await User.findById(quiz.ownerId);

        if (!user) {
            throw new Error("User Not Found");
        }

        let correctQuestions = quiz.correctQuestions;
        let wrongQuestions = quiz.wrongQuestions;
        let notAnsweredQuestions = quiz.notAnsweredQuestions;
        let userAnswers = quiz.userAnswers;

        const answers: Answer[] = req.body as Answer[];
        console.log(answers);

        //Loop to check the correctness of each answer
        for (let i = 0; i < answers.length; i++) {
            const answer = answers[i];
            const question = await Question.find({})
                .where("questionId")
                .equals(answer.questionId)
                .exec();
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

        //Starting user's update
        let notExecutedQuizIds = user.notExecutedQuizIds;
        let executedQuizzes = user.executedQuizzes;
        let usersWrongQuestions = user.wrongQuestions;

        // console.log(notExecutedQuizIds[0] === quizId);

        //Removing the executedQuizId from the notExecuted ones
        notExecutedQuizIds.filter(
            (notExecutedQuizId) => notExecutedQuizId !== quizId
        );

        //Now this quiz becomes executed and can be shown on the user's dashboard
        executedQuizzes.push(quiz);

        //Also keep track of the questions that the user has got wrong
        wrongQuestions.forEach((wrongQuestion) =>
            usersWrongQuestions.push(wrongQuestion)
        );

        user.set({
            notExecutedQuizIds,
            executedQuizzes,
            wrongQuestions: usersWrongQuestions,
        });

        await user.save();

        res.status(200).send(quiz);
    }
);

export { router as updateQuizRouter };
