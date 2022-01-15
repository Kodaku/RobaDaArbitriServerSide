import { QuestionDoc } from "./models/question";
import { QuizDoc } from "./models/quiz";

export interface UserType {
    firebaseId: string;
    userName: string;
    email: string;
    executedQuestionIds: number[];
    notExecutedQuizIds: string[];
    executedQuizzes: QuizDoc[];
    wrongQuestions: QuestionDoc[];
}
