import { Message } from "node-nats-streaming";
import { Subjects, Listener, UserDeletedEvent } from "@rdaserver/common";
import { User } from "../../models/user";
import { queueGroupName } from "./queue-group-name";

export class UserDeletedListener extends Listener<UserDeletedEvent> {
    subject: Subjects.UserDeleted = Subjects.UserDeleted;
    queueGroupName: string = queueGroupName;

    async onMessage(data: UserDeletedEvent["data"], msg: Message) {
        const { id } = data;

        const result = await User.findByIdAndDelete(id);

        // console.log(result);

        msg.ack();
    }
}
