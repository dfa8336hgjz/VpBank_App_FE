import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  UserInfoResponse
} from "../types/auth-type";
import { BaseAPI } from "./base-api";

class AuthAPI extends BaseAPI {
  constructor() {
    super("/identity");
  }

  // Authentication endpoints
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    console.log('Login request:', credentials)
    return this.post("/auth/token", credentials);
  }

  async register(credentials: RegisterRequest): Promise<RegisterResponse> {
    return this.post("/users/registration", credentials);
  }

  async getUserInfo(): Promise<UserInfoResponse> {
    return this.get("/users/my-info");
  }

}

export const authAPI = new AuthAPI();
export default authAPI;