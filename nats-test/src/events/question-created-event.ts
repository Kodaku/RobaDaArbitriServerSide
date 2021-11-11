import { Subjects } from "./subjects";

export interface QuestionCreatedEvent {
    subject: Subjects.QuestionCreated;
    data: {
        id: string;
        title: string;
        price: number;
    };
}