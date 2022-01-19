import mongoose from "mongoose";
import { app } from "./app";

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

    try {

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
