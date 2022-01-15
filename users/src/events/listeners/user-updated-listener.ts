import { Message } from "node-nats-streaming";
import { Subjects, Listener, UserUpdatedEvent } from "@rdaserver/common";
import { User } from "../../models/user";
import { queueGroupName } from "./queue-group-name";

export class UserUpdatedListener extends Listener<UserUpdatedEvent> {
    subject: Subjects.UserUpdated = Subjects.UserUpdated;
    queueGroupName: string = queueGroupName;

    async onMessage(data: UserUpdatedEvent["data"], msg: Message) {
        // console.log(data);
        const {
            firebaseId,
            userName,
            email,
            executedQuestionIds,
            notExecutedQuizIds,
            executedQuizzes,
            wrongQuestions,
        } = data;

        const user = await User.findByEvent(data);

        if (!user) {
            console.log("Auto User Update is not necessary");
            msg.ack();
            return;
        }

        user.set({
            firebaseId,
            userName,
            email,
            executedQuestionIds,
            notExecutedQuizIds,
            executedQuizzes,
            wrongQuestions,
        });

        await user.save();

        msg.ack();
    }
}
