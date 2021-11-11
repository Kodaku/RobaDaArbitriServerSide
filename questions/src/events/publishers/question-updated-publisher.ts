import { Publisher, QuestionUpdatedEvent, Subjects } from "@rdaserver/common";

export class QuestionUpdatedPublisher extends Publisher<QuestionUpdatedEvent> {
    subject: Subjects.QuestionUpdated = Subjects.QuestionUpdated;
}