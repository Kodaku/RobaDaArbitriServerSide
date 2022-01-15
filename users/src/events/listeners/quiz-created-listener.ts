import {
    Listener,
    Question,
    QuizCreatedEvent,
    Subjects,
} from "@rdaserver/common";
import { Message } from "node-nats-streaming";
import { Quiz } from "../../models/quiz";
import { User } from "../../models/user";
import { natsWrapper } from "../../nats-wrapper";
import { UserUpdatedPublisher } from "../publishers/user-updated-publisher";
import { queueGroupName } from "./queue-group-name";

export class QuizCreatedListener extends Listener<QuizCreatedEvent> {
    subject: Subjects.QuizCreated = Subjects.QuizCreated;
    queueGroupName: string = queueGroupName;
    async onMessage(data: QuizCreatedEvent["data"], msg: Message) {
        const {
            id,
            ownerId,
            wrongQuestions,
            correctQuestions,
            notAnsweredQuestions,
            quizQuestions,
            userAnswers,
        } = data;

        console.log(wrongQuestions);

        const quiz = Quiz.build({
            id,
            ownerId,
            wrongQuestions,
            correctQuestions,
            notAnsweredQuestions,
            quizQuestions,
            userAnswers,
        });

        await quiz.save();

        const user = await User.findById(ownerId);

        if (!user) {
            console.log("User not found while creating the quiz!");
            msg.ack();
            return;
        }

        quiz.populate("quizQuestions");

        let notExecutedQuizIds = user.notExecutedQuizIds;
        notExecutedQuizIds.push(quiz.id);

        let executedQuestionIds = user.executedQuestionIds;
        quizQuestions.forEach((quizQuestion) =>
            executedQuestionIds.push(quizQuestion.questionId)
        );

        user.set({
            executedQuestionIds,
            notExecutedQuizIds,
        });

        await user.save();

        quiz.depopulate();

        // new UserUpdatedPublisher(natsWrapper.client).publish({
        //     id: user.id,
        //     firebaseId: user.firebaseId,
        //     version: user.version,
        //     userName: user.userName,
        //     email: user.email,
        //     executedQuestionIds: user.executedQuestionIds,
        //     notExecutedQuizIds: user.notExecutedQuizIds,
        //     executedQuizzes: user.executedQuizzes,
        //     wrongQuestions: user.wrongQuestions,
        // });

        msg.ack();
    }
}
