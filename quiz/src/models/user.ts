import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { QuestionDoc } from "./question";
import { QuizDoc } from "./quiz";

interface UserAttrs {
    id: string;
    firebaseId: string;
    userName: string;
    email: string;
    executedQuestionIds: number[];
    notExecutedQuizIds: string[];
    executedQuizzes: QuizDoc[];
    wrongQuestions: QuestionDoc[];
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
    notExecutedQuizIds: string[];
    executedQuizzes: QuizDoc[];
    wrongQuestions: QuestionDoc[];
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
        notExecutedQuizIds: {
            type: [String],
            required: true,
        },
        executedQuizzes: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "Quiz",
            required: true,
        },
        wrongQuestions: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "Question",
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
        _id: attrs.id,
        firebaseId: attrs.firebaseId,
        userName: attrs.userName,
        email: attrs.email,
        executedQuestionIds: attrs.executedQuestionIds,
        notExecutedQuizIds: attrs.notExecutedQuizIds,
        executedQuizzes: attrs.executedQuizzes,
        wrongQuestions: attrs.wrongQuestions,
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
