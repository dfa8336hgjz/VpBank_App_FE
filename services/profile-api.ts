import {
  GetAllUsersSummariesResponse,
  GetBalanceResponse,
  GetJarInfoResponse,
  GetSurveyQuestionsResponse,
  SubmitSurveyRequest,
  SubmitSurveyResponse,
  UpdateJarPercentagesRequest
} from "../types/profile-type";
import { BaseAPI } from "./base-api";

class ProfileAPI extends BaseAPI {
  constructor() {
    super("/profile");
  }

  // Authentication endpoints
  async getSurveyQuestions(): Promise<GetSurveyQuestionsResponse> {
    return this.get("/surveys");
  }

  async submitSurvey(surveyAnswers: SubmitSurveyRequest): Promise<SubmitSurveyResponse> {
    return this.post("/surveys/submit", { surveyAnswers });
  }

  async getAllUsersSummaries(): Promise<GetAllUsersSummariesResponse> {
    return this.get("/users/summary");
  }

  async getJarInfo(): Promise<GetJarInfoResponse> {
    return this.get("/jar-division/my");
  }

  async updateJarPercentages(percentages: UpdateJarPercentagesRequest): Promise<GetJarInfoResponse> {
    return this.post("/jar-division", percentages);
  }

  async getBalance(): Promise<GetBalanceResponse> {
    return this.get("/balance/my");
  }
  
}

export const profileAPI = new ProfileAPI();
export default profileAPI;