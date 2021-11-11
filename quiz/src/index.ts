import mongoose from 'mongoose';
import { natsWrapper } from './nats-wrapper';
import { app } from './app';
import { QuestionCreatedListener } from './events/listeners/question-created-listener';
import { QuestionUpdatedListener } from './events/listeners/question-updated-listener';
import { UserCreatedListener } from './events/listeners/user-created-listener';
import { UserUpdatedListener } from './events/listeners/user-updated-listener';

// console.log(questions);

// if(!process.env.DATABASE) {
//     throw new Error("Database variable not defined");
// }

// if(!process.env.DB_PASSWORD) {
//     throw new Error("Database password not defined")
// }
const start = async () => {
    if(!process.env.QUIZ_MONGO_URI) {
        throw new Error("Quiz Database not defined");
    }

    if(!process.env.NATS_URL) {
        throw new Error("Nats URL not defined");
    }

    if(!process.env.NATS_CLIENT_ID) {
        throw new Error("Nats client ID not defined");
    }

    if(!process.env.NATS_CLUSTER_ID) {
        throw new Error("Nats cluster ID not defined");
    }

    try {
        await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL);

        natsWrapper.client.on('close', () => {
            console.log("NATS connection closed");
            process.exit();
        });

        process.on('SIGINT', () => natsWrapper.client.close());
        process.on('SIGTERM', () => natsWrapper.client.close());

        new QuestionCreatedListener(natsWrapper.client).listen();
        new QuestionUpdatedListener(natsWrapper.client).listen();
        new UserCreatedListener(natsWrapper.client).listen();
        new UserUpdatedListener(natsWrapper.client).listen();

        // const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DB_PASSWORD);
        mongoose.connect(process.env.QUIZ_MONGO_URI, async () => {
            console.log("Connceted to the QUIZ database!");
        });

    } catch (err) {
        console.log(err);
    }

    app.listen(3000, () => {
        console.log("QUIZ Listening on port 3000");
    });
}

start();