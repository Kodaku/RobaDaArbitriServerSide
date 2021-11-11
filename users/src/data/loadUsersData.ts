import { UserCreatedPublisher } from "../events/user-created-publisher";
import { User, UserAttrs } from "../models/user";
import { natsWrapper } from "../nats-wrapper";

export const loadUsersData = async (users: UserAttrs[]) => {
    for(let i = 0; i < users.length; i++) {
        const user: UserAttrs = users[i];
        // console.log(`Loading user ${user.questionText}`);
        var query = User.find({});
        var resp = await query.where('userName').equals(user.userName).exec();
        if(resp[0])
        {
            console.log("This data is already in the DB");
            continue;
        }
        const userToSave = User.build({
            userName: user.userName,
            email: user.email,
            executedQuestionIds: user.executedQuestionIds,
            executedQuizIds: user.executedQuizIds,
        });

        await userToSave.save();
        
        new UserCreatedPublisher(natsWrapper.client).publish({
            id: userToSave.id,
            version: userToSave.version,
            userName: userToSave.userName,
            email: userToSave.email,
            executedQuestionIds: userToSave.executedQuestionIds,
            executedQuizIds: userToSave.executedQuizIds,
        });
    }
}