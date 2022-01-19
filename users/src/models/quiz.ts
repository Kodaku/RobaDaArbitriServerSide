import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { QuestionDoc } from "./question";

interface QuizAttrs {
    ownerId: string;
    wrongQuestions: QuestionDoc[];
    correctQuestions: QuestionDoc[];
    notAnsweredQuestions: QuestionDoc[];
    quizQuestions: QuestionDoc[];
    userAnswers: string[];
}

interface QuizModel extends mongoose.Model<QuizDoc> {
    build(attrs: QuizAttrs): QuizDoc;
}

export interface QuizDoc extends mongoose.Document {
    ownerId: string;
    wrongQuestions: QuestionDoc[];
    correctQuestions: QuestionDoc[];
    notAnsweredQuestions: QuestionDoc[];
    quizQuestions: QuestionDoc[];
    userAnswers: string[];
    version: number;
}

const quizSchema = new mongoose.Schema(
    {
        ownerId: {
            type: String,
        },
        wrongQuestions: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "Question",
            required: true,
        },
        correctQuestions: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "Question",
            required: true,
        },
        notAnsweredQuestions: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "Question",
            required: true,
        },
        quizQuestions: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "Question",
            required: true,
        },
        userAnswers: {
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

quizSchema.set("versionKey", "version");
quizSchema.plugin(updateIfCurrentPlugin);

quizSchema.pre("save", async function (next) {
    // console.log("Saving the QUIZ document data...");
    next();
});

quizSchema.statics.build = (attrs: QuizAttrs) => {
    return new Quiz(attrs);
};

const Quiz = mongoose.model<QuizDoc, QuizModel>("Quiz", quizSchema);

export { Quiz };
