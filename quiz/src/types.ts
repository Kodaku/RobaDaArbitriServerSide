export interface QuestionType {
    id: string;
    questionId: number;
    questionText: string;
    questionCategory: string;
    wrongOptions: string[];
    correctOptions: string;
    questionOptions: string[];
}

export interface QuizType {
    questionsIds: number[];
    wrongQuestionsIds: number[];
    correctQuestionsIds: number[];
}

export interface UserType {
    id: string;
    userName: string;
    email: string;
    executedQuestionIds: number[];
    executedQuizIds: string[];
}

export interface Answer {
    questionId: number;
    isCorrect: boolean;
    userAnswer: string;
}
