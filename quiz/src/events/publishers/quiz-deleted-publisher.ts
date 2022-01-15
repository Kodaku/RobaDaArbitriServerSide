import { Publisher, QuizDeletedEvent, Subjects } from "@rdaserver/common";

export class QuizDeletedPublisher extends Publisher<QuizDeletedEvent> {
    subject: Subjects.QuizDeleted = Subjects.QuizDeleted;
}
