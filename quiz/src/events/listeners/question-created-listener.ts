import { Message } from "node-nats-streaming";
import { Subjects, Listener, QuestionCreatedEvent } from "@rdaserver/common";
import { Question } from "../../models/question";
import { queueGroupName } from "./queue-group-name";

export class QuestionCreatedListener extends Listener<QuestionCreatedEvent> {
    subject: Subjects.QuestionCreated = Subjects.QuestionCreated;
    queueGroupName: string = queueGroupName;

    async onMessage(data: QuestionCreatedEvent["data"], msg: Message) {
        const {
            id,
            questionId,
            questionText,
            questionCategory,
            wrongOptions,
            correctOptions,
            questionOptions,
        } = data;

        const question = Question.build({
            id,
            questionId,
            questionText,
            questionCategory,
            wrongOptions,
            correctOptions,
            questionOptions,
        });

        await question.save();

        msg.ack();
    }
}
