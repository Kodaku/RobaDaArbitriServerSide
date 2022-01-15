export interface QuestionType {
    questionId: number;
    questionText: string;
    questionCategory: string;
    wrongAnswers: string[];
    correctAnswers: string;
    questionOptions: string[];
    answerLink: string;
}
