import { Router, Request, Response } from "express";
import mongoose from 'mongoose';
import { Question } from "../models/question";
import { Quiz } from "../models/quiz";
import { questionsNumber } from "../data/readTotalQuestionsNumber";

const router = Router();

router.get('/api/quiz/generic', async (req: Request, res: Response) => {
    const quizQuestionsIds: number[] = [1];
    const wrongQuestionsIds: number[] = [];
    const correctQuestionsIds: number[] = [];

    const totalQuestions: number = questionsNumber;
    
    for(let i = 0; i < 20; i++) {
        const questionId: number = Math.floor(Math.random() * totalQuestions + 1);
        quizQuestionsIds.push(questionId);
        wrongQuestionsIds.push(0);
        correctQuestionsIds.push(0);
    }

    const quiz = Quiz.build({
        questionsIds: quizQuestionsIds,
        wrongQuestionsIds: wrongQuestionsIds,
        correctQuestionsIds: correctQuestionsIds
    });

    await quiz.save();

    const quizQuestions = [];

    for(let i = 0; i < quizQuestionsIds.length; i++) {
        const question = await Question.find({}).where('questionId').equals(quizQuestionsIds[i]).exec();
        quizQuestions.push(question[0]);
    }

    res.status(200).json({
        quiz: quiz,
        quizQuestions: quizQuestions
    });
});

router.get('/api/quiz/:category', async (req: Request, res: Response) => {
    const category = req.params.category;

    console.log(category);

    var query = Question.find({});

    const validQuestions = await query.where('questionCategory').equals(category).exec();

    res.status(200).send(validQuestions[0]);
});

export { router as createQuizRouter };