import mongoose from "mongoose";
import { natsWrapper } from "./nats-wrapper";
import { app } from "./app";
import { loadUsersData } from "./data/loadUsersData";
import { users } from "./data/readUsersData";
import { UserUpdatedListener } from "./events/listeners/user-updated-listener";
import { QuestionCreatedListener } from "./events/listeners/question-created-listener";
import { QuestionUpdatedListener } from "./events/listeners/question-updated-listener";
import { QuizCreatedListener } from "./events/listeners/quiz-created-listener";
import { QuizUpdatedListener } from "./events/listeners/quiz-updated-listener";
import { QuestionDeletedListener } from "./events/listeners/question-deleted-listener";

// console.log(questions);

// if(!process.env.DATABASE) {
//     throw new Error("Database variable not defined");
// }

// if(!process.env.DB_PASSWORD) {
//     throw new Error("Database password not defined")
// }
const start = async () => {
    if (!process.env.USERS_MONGO_URI) {
        throw new Error("Users Database not defined");
    }

    if (!process.env.NATS_URL) {
        throw new Error("Nats URL not defined");
    }

    if (!process.env.NATS_CLIENT_ID) {
        throw new Error("Nats client ID not defined");
    }

    if (!process.env.NATS_CLUSTER_ID) {
        throw new Error("Nats cluster ID not defined");
    }

    try {
        await natsWrapper.connect(
            process.env.NATS_CLUSTER_ID,
            process.env.NATS_CLIENT_ID,
            process.env.NATS_URL
        );

        natsWrapper.client.on("close", () => {
            console.log("NATS connection closed");
            process.exit();
        });

        process.on("SIGINT", () => natsWrapper.client.close());
        process.on("SIGTERM", () => natsWrapper.client.close());

        new UserUpdatedListener(natsWrapper.client).listen();
        new QuestionCreatedListener(natsWrapper.client).listen();
        new QuestionUpdatedListener(natsWrapper.client).listen();
        new QuestionDeletedListener(natsWrapper.client).listen();
        new QuizCreatedListener(natsWrapper.client).listen();
        new QuizUpdatedListener(natsWrapper.client).listen();

        // const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DB_PASSWORD);
        mongoose.connect(process.env.USERS_MONGO_URI, async () => {
            console.log("Connceted to the USER database!");
            // await loadUsersData(users);
            // console.log("Initial Users Data Successfully Loaded");
        });
    } catch (err) {
        console.log(err);
    }

    app.listen(5000, () => {
        console.log("USERS Listening on port 5000");
    });
};

start();
