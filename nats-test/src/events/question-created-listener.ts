import { Message } from 'node-nats-streaming';
import { Listener } from './base-listener';
import { QuestionCreatedEvent } from './question-created-event';
import { Subjects } from './subjects';

class QuestionCreatedListener extends Listener<QuestionCreatedEvent> {
    subject: Subjects.QuestionCreated = Subjects.QuestionCreated;

    queueGroupName: string = 'questions-service';

    onMessage(data: QuestionCreatedEvent['data'], msg: Message): void {
        console.log('Event Data!', data);

        msg.ack();
    }
    
}

export { QuestionCreatedListener };