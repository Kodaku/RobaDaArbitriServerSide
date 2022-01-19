import { Request, Response, Router } from "express";
import { User } from "../../models/user";

const router = Router();

/** Delete a user with a given id */
router.get("/api/users/delete/:userId", async (req: Request, res: Response) => {
    const userId = req.params.userId;

    const result = await User.findByIdAndDelete(userId);
    // console.log(result);

    if (!result) {
        throw new Error("Error while deleting the question");
    }

    res.status(200).send(result);
});

export { router as deleteUserRouter };
