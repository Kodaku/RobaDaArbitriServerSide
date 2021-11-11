import { Publisher, QuestionCreatedEvent, Subjects } from "@rdaserver/common";

export class QuestionCreatedPublisher extends Publisher<QuestionCreatedEvent> {
    subject: Subjects.QuestionCreated = Subjects.QuestionCreated;
}