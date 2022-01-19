import { Router, Request, Response } from "express";
import { Question, QuestionDoc } from "../../models/question";
import { Quiz } from "../../models/quiz";
import { allQuestionsIds } from "../../data/readTotalQuestionsNumber";
import { User } from "../../models/user";

const router = Router();

/** This is the more elaborate function of the server
First we extract the questionIds the user has already done
Then we check if the user has less than 20 questions left then he/she will be able to redo all the questions
The array availableQuestionIds is an array with the questionIds that the user has not executed yet
Then we extract its length
After that we iterate from 0 to 20 and each time we pick a random index to extract some random questionId from the availableQuestioIds array
If the index we've extracted was previously extracted we don't count this iteration
Otherwise we add this index to the quizQuestionIds array and also to executedQuestionIds array
Out of the for loop we build the quiz and we update the user */
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
    let executedQuizzes = user.executedQuizzes;

    if (allQuestionsIds.length - executedQuestionIds.length < 20) {
        executedQuestionIds = [];
    }

    //Filter the questions the user has not executed yet
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
        //Random index
        const questionIndex: number = Math.floor(
            Math.random() * totalQuestions
        );
        //Check if the extracted index is already in the quizQuestionIds array
        const index = quizQuestionsIds.findIndex(
            (quizQuestionId) =>
                quizQuestions[questionIndex].questionId === quizQuestionId - 1
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

    executedQuizzes.push(quiz);
    notExecutedQuizIds.push(quiz.id);

    user.set({
        executedQuestionIds: executedQuestionIds,
        notExecutedQuizIds: notExecutedQuizIds,
        executedQuizzes: executedQuizzes,
    });

    await user.save();

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
