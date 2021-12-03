import { Publisher, UserUpdatedEvent, Subjects } from "@rdaserver/common";

export class UserUpdatedPublisher extends Publisher<UserUpdatedEvent> {
    subject: Subjects.UserUpdated = Subjects.UserUpdated;
}