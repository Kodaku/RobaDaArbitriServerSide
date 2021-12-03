export interface QuestionType {
    questionId: number;
    questionText: string;
    questionCategory: string;
    wrongOptions: string[];
    correctOptions: string[];
}