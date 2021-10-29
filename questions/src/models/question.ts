import mongoose from 'mongoose';

export interface QuestionAttrs {
    questionId: number;
    questionText: string;
    questionCategory: string;
    wrongOptions: string[];
    correctOptions: string[];
}

interface QuestionModel extends mongoose.Model<QuestionDoc> {
    build(attrs: QuestionAttrs): QuestionDoc;
}

interface QuestionDoc extends mongoose.Document {
    questionId: number;
    questionText: string;
    questionCategory: string;
    wrongOptions: string[];
    correctOptions: string[];
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
            delete ret.__v;
        }
    }
}
);

questionSchema.pre('save', async function (next) {
    console.log("Saving the QUIZ document data...");
    next();
});

questionSchema.statics.build = (attrs: QuestionAttrs) => {
    return new Question(attrs);
};

const Question = mongoose.model<QuestionDoc, QuestionModel>('Question', questionSchema);

export { Question };