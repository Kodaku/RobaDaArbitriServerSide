import nats from 'node-nats-streaming';
import { QuestionCreatedPublisher } from './events/question-created-publisher';

console.clear();

const stan = nats.connect('robadaarbitri', 'abc', {
    url: 'http://localhost:4222'
});

stan.on('connect', async () => {
    console.log("Publisher connected to NATS");

    // const data = JSON.stringify({
    //     id: '123',
    //     title: 'concert',
    //     price: '20'
    // });

    // stan.publish('question:created', data, () => {
    //     console.log('Event published');
    // });
    const publisher = new QuestionCreatedPublisher(stan);
    try {
        await publisher.publish({
        id: '123',
        title: 'concert',
        price: 20
        });
    } catch(err) {
        console.error(err);
    }
});