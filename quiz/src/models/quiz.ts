import mongoose from 'mongoose';

export interface QuizAttrs {
    quizId: number;
    questionId: number;
    questionText: string;
    wrongOptions: string[];
    correctOptions: string[];
}

interface QuizModel extends mongoose.Model<QuizDoc> {
    build(attrs: QuizAttrs): QuizDoc;
}

interface QuizDoc extends mongoose.Document {
    quizId: number;
    questionId: number;
    questionText: string;
    wrongOptions: string[];
    correctOptions: string[];
}

const quizSchema = new mongoose.Schema({
    quizId: {
        type: Number,
        required: true
    },
    questionId: {
        type: Number,
        required: true
    },
    questionText: {
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

quizSchema.pre('save', async function (next) {
    console.log("Saving the QUIZ document data...");
    next();
});

quizSchema.statics.build = (attrs: QuizAttrs) => {
    return new Quiz(attrs);
};

const Quiz = mongoose.model<QuizDoc, QuizModel>('Quiz', quizSchema);

export { Quiz };