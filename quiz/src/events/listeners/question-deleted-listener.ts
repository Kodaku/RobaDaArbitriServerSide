import { Message } from "node-nats-streaming";
import { Subjects, Listener, QuestionDeletedEvent } from "@rdaserver/common";
import { Question } from "../../models/question";
import { queueGroupName } from "./queue-group-name";

export class QuestionDeletedListener extends Listener<QuestionDeletedEvent> {
    subject: Subjects.QuestionDeleted = Subjects.QuestionDeleted;
    queueGroupName: string = queueGroupName;

    async onMessage(data: QuestionDeletedEvent["data"], msg: Message) {
        const {
            id,
            questionId,
            questionText,
            questionCategory,
            wrongOptions,
            correctOptions,
        } = data;

        const result = await Question.findOneAndDelete({
            questionId: questionId,
        });

        // console.log(result);

        msg.ack();
    }
}
