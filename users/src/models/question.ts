import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface QuestionAttrs {
    questionId: number;
    questionText: string;
    questionCategory: string;
    wrongOptions: string[];
    correctOptions: string;
    questionOptions: string[];
    answerLink: string;
}

interface QuestionModel extends mongoose.Model<QuestionDoc> {
    build(attrs: QuestionAttrs): QuestionDoc;
}

export interface QuestionDoc extends mongoose.Document {
    questionId: number;
    questionText: string;
    questionCategory: string;
    wrongOptions: string[];
    correctOptions: string;
    questionOptions: string[];
    answerLink: string;
    version: number;
}

const questionSchema = new mongoose.Schema(
    {
        questionId: {
            type: Number,
            required: true,
        },
        questionText: {
            type: String,
            required: true,
        },
        questionCategory: {
            type: String,
            required: true,
        },
        wrongOptions: {
            type: [String],
            required: true,
        },
        correctOptions: {
            type: String,
            required: true,
        },
        questionOptions: {
            type: [String],
            required: true,
        },
        answerLink: {
            type: String,
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

questionSchema.set("versionKey", "version");
questionSchema.plugin(updateIfCurrentPlugin);

questionSchema.pre("save", async function (next) {
    // console.log("Saving the QUIZ document data...");
    next();
});

questionSchema.statics.build = (attrs: QuestionAttrs) => {
    return new Question(attrs);
};

const Question = mongoose.model<QuestionDoc, QuestionModel>(
    "Question",
    questionSchema
);

export { Question };
