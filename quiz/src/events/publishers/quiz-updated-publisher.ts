import { Publisher, QuizUpdatedEvent, Subjects } from "@rdaserver/common";

export class QuizUpdatedPublisher extends Publisher<QuizUpdatedEvent> {
    subject: Subjects.QuizUpdated = Subjects.QuizUpdated;
}
