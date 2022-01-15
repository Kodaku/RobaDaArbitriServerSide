import { Listener, QuizUpdatedEvent, Subjects } from "@rdaserver/common";
import { Message } from "node-nats-streaming";
import { Quiz } from "../../models/quiz";
import { User } from "../../models/user";
import { queueGroupName } from "./queue-group-name";

export class QuizUpdatedListener extends Listener<QuizUpdatedEvent> {
    subject: Subjects.QuizUpdated = Subjects.QuizUpdated;
    queueGroupName: string = queueGroupName;

    async onMessage(data: QuizUpdatedEvent["data"], msg: Message) {
        const {
            id,
            ownerId,
            wrongQuestions,
            correctQuestions,
            notAnsweredQuestions,
            quizQuestions,
            userAnswers,
        } = data;

        const user = await User.findById(ownerId);

        if (!user) {
            console.log("User not found while updating the quiz!");
            msg.ack();
            return;
        }

        const quiz = await Quiz.findByEvent(data);

        if (!quiz) {
            console.log("Quiz Not Found while updating on the users-service");
            msg.ack();
            return;
        }

        // const wrongQuestionIds = wrongQuestions.map(
        //     (wrongQuestion) => new mongoose.Schema.Types.ObjectId(wrongQuestion.id)
        // );

        // console.log(wrongQuestionIds);

        // const correctQuestionIds = correctQuestions.map(
        //     (correctQuestion) => correctQuestion.id
        // );

        // const notAnsweredQuestionIds = notAnsweredQuestions.map(
        //     (notAnsweredQuestion) => notAnsweredQuestion.id
        // );

        quiz.set({
            wrongQuestions,
            correctQuestions,
            notAnsweredQuestions,
            quizQuestions,
            userAnswers,
        });

        await quiz.save();

        // console.log("Executed Quiz: ", quiz);

        let notExecutedQuizIds = user.notExecutedQuizIds;
        let executedQuizzes = user.executedQuizzes;
        let usersWrongQuestions = user.wrongQuestions;

        console.log(notExecutedQuizIds[0] === id);

        notExecutedQuizIds.filter(
            (notExecutedQuizId) => notExecutedQuizId !== id
        );

        executedQuizzes.push(quiz);

        wrongQuestions.forEach((wrongQuestion) =>
            usersWrongQuestions.push(wrongQuestion)
        );

        user.set({
            notExecutedQuizIds,
            executedQuizzes,
            wrongQuestions: usersWrongQuestions,
        });

        await user.save();

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
