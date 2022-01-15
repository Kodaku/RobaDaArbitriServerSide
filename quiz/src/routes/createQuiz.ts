import { Router, Request, Response } from "express";
import { Question, QuestionDoc } from "../models/question";
import { Quiz } from "../models/quiz";
import {
    allQuestionsIds,
    questionsNumber,
} from "../data/readTotalQuestionsNumber";
import { User } from "../models/user";
import { UserUpdatedPublisher } from "../events/publishers/user-updated-publisher";
import { natsWrapper } from "../nats-wrapper";
import { QuizCreatedPublisher } from "../events/publishers/quiz-created-publisher";

const router = Router();

router.get("/api/quiz/generic/:userId", async (req: Request, res: Response) => {
    const quizQuestionsIds: number[] = [];
    const quizQuestions: QuestionDoc[] = [];

    const userId = req.params.userId;

    const user = await User.findById(userId);

    if (!user) {
        throw new Error("User Not Found");
    }

    console.log(user);

    let executedQuestionIds = user.executedQuestionIds;
    let notExecutedQuizIds = user.notExecutedQuizIds;

    if (allQuestionsIds.length - executedQuestionIds.length < 20) {
        executedQuestionIds = [];
    }

    const availableQuestionsIds = allQuestionsIds.filter((questionId) => {
        let found = false;
        for (let i = 0; i < executedQuestionIds.length; i++) {
            if (questionId == executedQuestionIds[i]) {
                found = true;
                break;
            }
        }

        if (!found) {
            return questionId;
        }
    });

    const totalQuestions: number = availableQuestionsIds.length;

    for (let i = 0; i < 20; i++) {
        const questionIndex: number = Math.floor(
            Math.random() * totalQuestions
        );
        const index = quizQuestionsIds.findIndex(
            (quizQuestionId) => questionIndex === quizQuestionId - 1
        );
        // console.log(questionIndex);
        if (index < 0) {
            const questionId = availableQuestionsIds[questionIndex];
            const question = await Question.find({
                questionId: questionId,
            });
            quizQuestions.push(question[0]);
            quizQuestionsIds.push(questionId);
            executedQuestionIds.push(questionId);
        } else {
            i--;
        }
    }

    const quiz = Quiz.build({
        ownerId: userId,
        wrongQuestions: [],
        correctQuestions: [],
        notAnsweredQuestions: [],
        quizQuestions: quizQuestions,
        userAnswers: [],
    });

    // quiz.populate("quizQuestions");

    await quiz.save();

    // executedQuizzes.push(quiz);
    notExecutedQuizIds.push(quiz.id);

    user.set({
        executedQuestionIds: executedQuestionIds,
        notExecutedQuizIds: notExecutedQuizIds,
    });

    await user.save();

    new QuizCreatedPublisher(natsWrapper.client).publish({
        id: quiz.id,
        version: quiz.version,
        ownerId: quiz.ownerId,
        wrongQuestions: quiz.wrongQuestions,
        correctQuestions: quiz.correctQuestions,
        notAnsweredQuestions: quiz.notAnsweredQuestions,
        quizQuestions: quiz.quizQuestions,
        userAnswers: quiz.userAnswers,
    });

    // new UserUpdatedPublisher(natsWrapper.client).publish({
    //     id: user.id,
    //     firebaseId: user.firebaseId,
    //     version: user.version,
    //     userName: user.userName,
    //     email: user.email,
    //     executedQuestionIds: user.executedQuestionIds,
    //     notExecutedQuizIds: user.notExecutedQuizIds,
    //     wrongQuestions: user.wrongQuestions,
    //     executedQuizzes: user.executedQuizzes,
    // });

    // const quizQuestions = [];

    // for(let i = 0; i < quizQuestionsIds.length; i++) {
    //     const question = await Question.find({}).where('questionId').equals(quizQuestionsIds[i]).exec();
    //     quizQuestions.push(question[0]);
    // }

    res.status(200).json({
        quiz: quiz,
        user: user,
        questions: quizQuestions,
    });
});

router.post("/api/quiz/by-category", async (req: Request, res: Response) => {
    const categories: string[] = req.body as string[];

    console.log(categories);
    console.log(req.body);

    const questionsIds = [];
    const quizQuestions = [];

    for (let i = 0; i < categories.length; i++) {
        var query = Question.find({});
        const categoryQuestions = await query
            .where("questionCategory")
            .equals(categories[i])
            .exec();
        for (let j = 0; j < categoryQuestions.length; j++) {
            questionsIds.push(categoryQuestions[j].questionId);
            quizQuestions.push(categoryQuestions[j]);
        }
    }

    const quiz = Quiz.build({
        ownerId: "",
        quizQuestions: quizQuestions,
        wrongQuestions: [],
        correctQuestions: [],
        notAnsweredQuestions: [],
        userAnswers: [],
    });

    await quiz.save();

    // for (let i = 0; i < questionsIds.length; i++) {
    //     const question = await Question.find({ questionId: questionsIds[i] });
    //     quizQuestions.push(question[0]);
    // }

    res.status(200).json({
        quiz: quiz,
        questions: quizQuestions,
    });
});

export { router as createQuizRouter };
