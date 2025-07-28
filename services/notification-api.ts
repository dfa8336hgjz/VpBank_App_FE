import { GetNotificationsResponse } from "../types/notification-type";
import { BaseAPI } from "./base-api";

class NotificationAPI extends BaseAPI {
  constructor() {
    super("/notification");
  }

  // Authentication endpoints
  async getNotifications(): Promise<GetNotificationsResponse> {
    return this.get("/notifications/my");
  }
}

export const notificationAPI = new NotificationAPI();
export default notificationAPI;