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

export interface QuestionType {
    questionId: number;
    questionText: string;
    questionCategory: string;
    wrongAnswers: string[];
    correctAnswers: string;
    questionOptions: string[];
    answerLink: string;
}

export interface Answer {
    questionId: number;
    isCorrect: boolean;
    userAnswer?: string;
}
