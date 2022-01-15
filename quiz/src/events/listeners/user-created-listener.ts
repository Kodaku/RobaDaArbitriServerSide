import { Message } from "node-nats-streaming";
import { Subjects, Listener, UserCreatedEvent } from "@rdaserver/common";
import { User } from "../../models/user";
import { queueGroupName } from "./queue-group-name";

export class UserCreatedListener extends Listener<UserCreatedEvent> {
    subject: Subjects.UserCreated = Subjects.UserCreated;
    queueGroupName: string = queueGroupName;

    async onMessage(data: UserCreatedEvent["data"], msg: Message) {
        const {
            id,
            firebaseId,
            userName,
            email,
            executedQuestionIds,
            notExecutedQuizIds,
            executedQuizzes,
            wrongQuestions,
        } = data;

        const user = User.build({
            id: id,
            firebaseId: firebaseId,
            userName: userName,
            email: email,
            executedQuestionIds: executedQuestionIds,
            notExecutedQuizIds: notExecutedQuizIds,
            executedQuizzes: executedQuizzes,
            wrongQuestions: wrongQuestions,
        });

        await user.save();

        msg.ack();
    }
}
