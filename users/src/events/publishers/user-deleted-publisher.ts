import { Publisher, UserDeletedEvent, Subjects } from "@rdaserver/common";

export class UserDeletedPublisher extends Publisher<UserDeletedEvent> {
    subject: Subjects.UserDeleted = Subjects.UserDeleted;
}
