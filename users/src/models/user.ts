import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface UserAttrs {
    firebaseId: string;
    userName: string;
    email: string;
    executedQuestionIds: number[];
    executedQuizIds: string[];
}

interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
    findByEvent(event: {
        id: string;
        version: number;
    }): Promise<UserDoc | null>;
}

interface UserDoc extends mongoose.Document {
    firebaseId: string;
    userName: string;
    email: string;
    executedQuestionIds: number[];
    executedQuizIds: string[];
    version: number;
}

const userSchema = new mongoose.Schema(
    {
        firebaseId: {
            type: String,
        },
        userName: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        executedQuestionIds: {
            type: [Number],
            required: true,
        },
        executedQuizIds: {
            type: [String],
            required: true,
        },
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
            },
        },
    }
);

userSchema.set("versionKey", "version");
userSchema.plugin(updateIfCurrentPlugin);

userSchema.pre("save", async function (next) {
    next();
});

userSchema.statics.build = (attrs: UserAttrs) => {
    return new User({
        firebaseId: attrs.firebaseId,
        userName: attrs.userName,
        email: attrs.email,
        executedQuestionIds: attrs.executedQuestionIds,
        executedQuizIds: attrs.executedQuizIds,
    });
};

userSchema.statics.findByEvent = (event: { id: string; version: number }) => {
    return User.findOne({
        _id: event.id,
        version: event.version - 1,
    });
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
