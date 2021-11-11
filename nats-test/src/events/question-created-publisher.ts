import { Publisher } from "./base-publisher";
import { QuestionCreatedEvent } from "./question-created-event";
import { Subjects } from "./subjects";

export class QuestionCreatedPublisher extends Publisher<QuestionCreatedEvent> {
    subject: Subjects.QuestionCreated = Subjects.QuestionCreated;
    
}