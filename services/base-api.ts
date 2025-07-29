import AsyncStorage from "@react-native-async-storage/async-storage";
import type { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import axios from "axios";
import { router } from "expo-router";

// Extend axios config to include metadata
declare module "axios" {
  interface InternalAxiosRequestConfig {
    metadata?: {
      startTime: Date;
    };
  }
}

// Base API configuration
const API_BASE_URL = 'http://192.168.1.188:8888';
const API_TIMEOUT = 30000; 

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  async (config) => {
    // Skip token for login requests
    const isLoginRequest = config.url?.includes('/identity/auth/token');
    
    if (!isLoginRequest) {
      // Get token from localStorage or auth store
      const token = await AsyncStorage.getItem("accessToken");
      console.log('Token:', token)
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() };

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle responses and errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.config.metadata) {
    }

    return response;
  },
  (error: AxiosError) => {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      switch (status) {
        case 401:
          AsyncStorage.removeItem("accessToken");
          router.replace('/login')
          break;

        case 403:
          // Forbidden - user doesn't have permission
          console.error("Access forbidden:", data);
          break;

        case 404:
          // Not found
          console.error("Resource not found:", error.config?.url);
          break;

        case 429:
          // Rate limiting
          console.error("Too many requests. Please try again later.");
          break;

        case 500:
          // Internal server error
          console.error("Internal server error:", data);
          break;

        default:
          console.error("API Error:", data);
      }

      // Return formatted error with type safety
      const errorData = data as any;
      return Promise.reject({
        status,
        message: errorData?.message || "An error occurred",
        errors: errorData?.errors || [],
        data: data,
      });
    } else if (error.request) {
      // Network error - no response received
      console.error("Network error:", error.message);
      return Promise.reject({
        status: 0,
        message: "Network error. Please check your connection.",
        errors: ["Network connectivity issue"],
      });
    } else {
      // Other error
      console.error("Request error:", error.message);
      return Promise.reject({
        status: 0,
        message: error.message || "Request failed",
        errors: [error.message],
      });
    }
  }
);

// Generic API methods
export class BaseAPI {
  protected endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  // GET request
  async get<T = any>(path = "", params?: Record<string, any>): Promise<T> {
    const response = await apiClient.get(`${this.endpoint}${path}`, { params });
    return response.data;
  }

  // POST request
  async post<T = any>(path = "", data?: any): Promise<T> {
    const response = await apiClient.post(`${this.endpoint}${path}`, data);
    return response.data;
  }

  // PUT request
  async put<T = any>(path = "", data?: any): Promise<T> {
    const response = await apiClient.put(`${this.endpoint}${path}`, data);
    return response.data;
  }

  // PATCH request
  async patch<T = any>(path = "", data?: any): Promise<T> {
    const response = await apiClient.patch(`${this.endpoint}${path}`, data);
    return response.data;
  }

  // DELETE request
  async delete<T = any>(path = ""): Promise<T> {
    const response = await apiClient.delete(`${this.endpoint}/${path}`);
    return response.data;
  }
}

// Export configured axios instance for direct use if needed
export default apiClient;