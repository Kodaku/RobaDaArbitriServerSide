import { Publisher, QuizCreatedEvent, Subjects } from "@rdaserver/common";

export class QuizCreatedPublisher extends Publisher<QuizCreatedEvent> {
    subject: Subjects.QuizCreated = Subjects.QuizCreated;
}
