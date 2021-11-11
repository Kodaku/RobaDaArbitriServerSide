import { Message } from 'node-nats-streaming';
import { Subjects, Listener, UserCreatedEvent } from '@rdaserver/common';
import { User } from '../../models/user';
import { queueGroupName } from './queue-group-name';

export class UserCreatedListener extends Listener<UserCreatedEvent> {
    subject: Subjects.UserCreated = Subjects.UserCreated;
    queueGroupName: string = queueGroupName;
    
    async onMessage(data: UserCreatedEvent['data'], msg: Message) {
        const { id, userName, email, executedQuestionIds, executedQuizIds } = data;

        const user = User.build({
            id,
            userName,
            email,
            executedQuestionIds,
            executedQuizIds
        });

        await user.save();

        msg.ack();
    }
    
}