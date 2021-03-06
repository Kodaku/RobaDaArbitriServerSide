import { Request, Response, Router } from "express";
import { Question } from "../../models/question";

const router = Router();

router.post(
    "/api/questions/:questionId",
    async (req: Request, res: Response) => {
        const {
            questionId,
            questionText,
            questionCategory,
            wrongOptions,
            correctOptions,
            questionOptions,
            answerLink,
        } = req.body;
        console.log("Question body: ", req.body);
        const requestQuestionId = parseInt(req.params.questionId);

        const questions = await Question.find({})
            .where("questionId")
            .equals(requestQuestionId)
            .exec();

        const question = questions[0];

        question.set({
            questionId: questionId,
            questionText: questionText,
            questionCategory: questionCategory,
            wrongOptions: wrongOptions,
            correctOptions: correctOptions,
            questionOptions: questionOptions,
            answerLink: answerLink,
        });

        await question.save();
        // new QuestionUpdatedPublisher(natsWrapper.client).publish({
        //     id: question.id,
        //     version: question.version,
        //     questionId: question.questionId,
        //     questionText: question.questionText,
        //     questionCategory: question.questionCategory,
        //     wrongOptions: question.wrongOptions,
        //     correctOptions: question.correctOptions,
        //     questionOptions: question.questionOptions,
        //     answerLink: question.answerLink,
        // });

        res.status(200).send(question);
    }
);

export { router as updateQuestionRouter };
