import { Message } from "node-nats-streaming";
import { Subjects, Listener, QuestionUpdatedEvent } from "@rdaserver/common";
import { Question } from "../../models/question";
import { queueGroupName } from "./queue-group-name";

export class QuestionUpdatedListener extends Listener<QuestionUpdatedEvent> {
    subject: Subjects.QuestionUpdated = Subjects.QuestionUpdated;
    queueGroupName: string = queueGroupName;

    async onMessage(data: QuestionUpdatedEvent["data"], msg: Message) {
        const {
            questionId,
            questionText,
            questionCategory,
            wrongOptions,
            correctOptions,
            questionOptions,
            answerLink,
        } = data;

        const question = await Question.findByEvent(data);

        if (!question) {
            throw new Error("Question not found");
        }

        question.set({
            questionId,
            questionText,
            questionCategory,
            wrongOptions,
            correctOptions,
            questionOptions,
            answerLink,
        });

        await question.save();

        msg.ack();
    }
}
