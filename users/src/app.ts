import express from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import { createUserRouter } from './routes/createUser';
import { showUserRouter } from './routes/showUser';
import { updateUserRouter } from './routes/updateUser';

const app = express();
app.use(json());
app.use(cors());

app.use(createUserRouter);
app.use(showUserRouter);
app.use(updateUserRouter);

app.all('*', async (req, res) => {
    res.status(404).send("ROUTE NOT FOUND");
});

export { app };