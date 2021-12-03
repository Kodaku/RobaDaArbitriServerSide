import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface QuizAttrs {
    questionsIds: number[];
    wrongQuestionsIds: number[];
    correctQuestionsIds: number[];
}

interface QuizModel extends mongoose.Model<QuizDoc> {
    build(attrs: QuizAttrs): QuizDoc;
}

interface QuizDoc extends mongoose.Document {
    questionsIds: number[];
    wrongQuestionsIds: number[];
    correctQuestionsIds: number[];
    version: number;
}

const quizSchema = new mongoose.Schema({
    questionsIds: {
        type: [Number],
        required: true
    },
    wrongQuestionsIds: {
        type: [Number],
        required: true
    },
    correctQuestionsIds: {
        type: [Number],
        required: true
    },
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

quizSchema.set('versionKey', 'version');
quizSchema.plugin(updateIfCurrentPlugin);

quizSchema.pre('save', async function (next) {
    // console.log("Saving the QUIZ document data...");
    next();
});

quizSchema.statics.build = (attrs: QuizAttrs) => {
    return new Quiz(attrs);
};

const Quiz = mongoose.model<QuizDoc, QuizModel>('Quiz', quizSchema);

export { Quiz };