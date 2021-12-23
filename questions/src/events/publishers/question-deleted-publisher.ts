import { Publisher, QuestionDeletedEvent, Subjects } from "@rdaserver/common";

export class QuestionDeletedublisher extends Publisher<QuestionDeletedEvent> {
    subject: Subjects.QuestionDeleted = Subjects.QuestionDeleted;
}
