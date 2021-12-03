import mongoose from "mongoose";
import { natsWrapper } from "./nats-wrapper";
import { app } from "./app";
import { loadUsersData } from "./data/loadUsersData";
import { users } from "./data/readUsersData";
import { UserUpdatedListener } from "./events/listeners/user-updated-listener";

// console.log(questions);

// if(!process.env.DATABASE) {
//     throw new Error("Database variable not defined");
// }

// if(!process.env.DB_PASSWORD) {
//     throw new Error("Database password not defined")
// }
const start = async () => {
    if (!process.env.USERS_MONGO_URI) {
        throw new Error("Quiz Database not defined");
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
