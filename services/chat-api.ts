import { BaseAPI } from "./base-api";

class ChatbotAPI extends BaseAPI {
  constructor() {
    super("/chatbot");
  }

  // Authentication endpoints
  async chat(message: string): Promise<string> {
    return this.post("/chatbot/chat", { message });
  }
}

export const chatbotAPI = new ChatbotAPI();
export default chatbotAPI;