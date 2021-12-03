import { Router, Request, Response } from "express";
import { Question } from "../models/question";
import { Quiz } from "../models/quiz";
import {
    allQuestionsIds,
    questionsNumber,
} from "../data/readTotalQuestionsNumber";
import { User } from "../models/user";
import { UserUpdatedPublisher } from "../events/publishers/user-updated-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = Router();

router.get("/api/quiz/generic/:userId", async (req: Request, res: Response) => {
    const quizQuestionsIds: number[] = [];

    const userId = req.params.userId;

    const user = await User.findById(userId);

    if (!user) {
        throw new Error("User Not Found");
    }

    let executedQuestionIds = user.executedQuestionIds;
    let executedQuizIds = user.executedQuizIds;

    if (allQuestionsIds.length - executedQuestionIds.length < 20) {
        // user.set({ executedQuestionIds: [] });
        // await user.save();
        // new UserUpdatedPublisher(natsWrapper.client).publish({
        //     id: user.id,
        //     version: user.version,
        //     userName: user.userName,
        //     email: user.email,
        //     executedQuestionIds: user.executedQuestionIds,
        //     executedQuizIds: user.executedQuizIds
        // });
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
        const questionId = availableQuestionsIds[questionIndex];
        quizQuestionsIds.push(questionId);
        executedQuestionIds.push(questionId);
    }

    const quiz = Quiz.build({
        questionsIds: quizQuestionsIds,
        wrongQuestionsIds: [],
        correctQuestionsIds: [],
    });

    await quiz.save();

    executedQuizIds.push(quiz.id);

    user.set({
        executedQuestionIds: executedQuestionIds,
        executedQuizIds: executedQuizIds,
    });

    await user.save();

    new UserUpdatedPublisher(natsWrapper.client).publish({
        id: user.id,
        version: user.version,
        userName: user.userName,
        email: user.email,
        executedQuestionIds: user.executedQuestionIds,
        executedQuizIds: user.executedQuizIds,
    });

    // const quizQuestions = [];

    // for(let i = 0; i < quizQuestionsIds.length; i++) {
    //     const question = await Question.find({}).where('questionId').equals(quizQuestionsIds[i]).exec();
    //     quizQuestions.push(question[0]);
    // }

    const quizQuestions = [];

    for (let i = 0; i < quizQuestionsIds.length; i++) {
        const question = await Question.find({questionId: quizQuestionsIds[i]});
        quizQuestions.push(question);
    }

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

    const validQuestions = [];
    const questionsIds = [];

    for (let i = 0; i < categories.length; i++) {
        var query = Question.find({});
        const categoryQuestions = await query
            .where("questionCategory")
            .equals(categories[i])
            .exec();
        for (let j = 0; j < categoryQuestions.length; j++) {
            validQuestions.push(categoryQuestions[j]);
            questionsIds.push(categoryQuestions[j].questionId);
        }
    }

    const quiz = await Quiz.build({
        questionsIds: questionsIds,
        wrongQuestionsIds: [],
        correctQuestionsIds: [],
    });

    await quiz.save();

    const quizQuestions = [];

    for (let i = 0; i < questionsIds.length; i++) {
        const question = await Question.find({ questionId: questionsIds[i] });
        quizQuestions.push(question);
    }

    res.status(200).json({
        validQuestions: validQuestions,
        quiz: quiz,
        questions: quizQuestions,
    });
});

export { router as createQuizRouter };
