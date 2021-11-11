import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

export interface QuestionAttrs {
    id: string;
    questionId: number;
    questionText: string;
    questionCategory: string;
    wrongOptions: string[];
    correctOptions: string[];
}

interface QuestionModel extends mongoose.Model<QuestionDoc> {
    build(attrs: QuestionAttrs): QuestionDoc;
    findByEvent(event: { id: string, version: number }): Promise<QuestionDoc | null>;
}

interface QuestionDoc extends mongoose.Document {
    questionId: number;
    questionText: string;
    questionCategory: string;
    wrongOptions: string[];
    correctOptions: string[];
    version: number;
}

const questionSchema = new mongoose.Schema({
    questionId: {
        type: Number,
        required: true
    },
    questionText: {
        type: String,
        required: true
    },
    questionCategory: {
        type: String,
        required: true
    },
    wrongOptions: {
        type: [String],
        required: true
    },
    correctOptions: {
        type: [String],
        required: true
    }
},
{
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
}
);

questionSchema.set('versionKey', 'version');
questionSchema.plugin(updateIfCurrentPlugin);

questionSchema.pre('save', async function (next) {
    // console.log("Saving the QUIZ document data...");
    next();
});

questionSchema.statics.build = (attrs: QuestionAttrs) => {
    return new Question({
        _id: attrs.id,
        questionId: attrs.questionId,
        questionText: attrs.questionText,
        questionCategory: attrs.questionCategory,
        wrongOptions: attrs.wrongOptions,
        correctOptions: attrs.correctOptions
    });
};

questionSchema.statics.findByEvent = (event: { id: string, version: number }) => {
    return Question.findOne({
        _id: event.id,
        version: event.version - 1
    });
}

const Question = mongoose.model<QuestionDoc, QuestionModel>('Question', questionSchema);

export { Question };