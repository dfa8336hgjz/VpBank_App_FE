export interface GetSurveyQuestionsResponse {
    code: number;
    result: SurveyQuestion[];
}

export interface SurveyQuestion {
    id: string;
    title: string;
    description: string;
    question: string;
    type: string;
    options: SurveyOption[];
    createdAt: string;
}

export interface SurveyOption {
    optionId: string;
    optionText: string;
    value: string;
}

export interface SubmitSurveyRequest {
    surveyAnswers: SurveyAnswer[];
}

export interface SurveyAnswer {
    surveyId: string;
    answers: string[];
}

export interface SubmitSurveyResponse {
    code: number;
    message: string;
    result?: any;
}

export interface GetAllUsersSummariesResponse {
    code: number;
    result: UserSummary[];
}

export interface UserSummary {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    fullName: string;
}

export interface GetJarInfoResponse {
    code: number;
    result: JarInfo;
}

export interface JarInfo {
    userId: string;
    necessitiesPercentage: number;
    educationPercentage: number;
    entertainmentPercentage: number;
    savingsPercentage: number;
    investmentPercentage: number;
    givingPercentage: number;
}

export interface UpdateJarPercentagesRequest {
    necessitiesPercentage: number;
    educationPercentage: number;
    entertainmentPercentage: number;
    savingsPercentage: number;
    investmentPercentage: number;
    givingPercentage: number;
}

export interface GetBalanceResponse {
    code: number;
    result: Balance;
}

export interface Balance {
    id: string;
    userId: string;
    necessitiesBalance: number;
    educationBalance: number;
    entertainmentBalance: number;
    savingsBalance: number;
    investmentBalance: number;
    givingBalance: number;
    totalBalance: number;
    createdAt: string | null;
    updatedAt: string;
} 