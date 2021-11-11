import { Router, Request, Response } from "express";
import { User } from "../models/user";

const router = Router();

router.get("/api/users", async (req: Request, res: Response) => {
    const users = await User.find({});

    res.status(200).send(users);
});

router.get("/api/users/:id", async (req: Request, res: Response) => {
    const id = req.params.id;

    const user = await User.findById(id);

    if (!user) {
        throw new Error("User Not Found");
    }

    res.status(200).send(user);

});

export { router as showUserRouter };