// Authentication related types
export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    code: number;
    result: {
        token: string;
        expiryTime: string | null;
    };
}

export interface RegisterRequest {
    username: string;
    password: string;
    email: string;
    firstName: string;
    lastName: string;
    dob: string;
    city: string;
}

export interface RegisterResponse {
    code: number;
    result: UserInfo;
}

export interface UserInfoResponse {
    code: number;
    result: UserInfo;
}

export interface UserInfo {
    id: string;
    username: string;
    email: string | null;
    emailVerified: boolean;
    roles: Array<{
        name: string;
        description: string;
        permissions: string[];
    }>;
}