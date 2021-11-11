import { Publisher, UserCreatedEvent, Subjects } from "@rdaserver/common";

export class UserCreatedPublisher extends Publisher<UserCreatedEvent> {
    subject: Subjects.UserCreated = Subjects.UserCreated;
}