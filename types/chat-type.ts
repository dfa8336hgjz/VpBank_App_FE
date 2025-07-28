export interface ChatRequest {
    message: string;
}

export interface ChatResponse {
    statusCode: number;
    success: boolean;
    message: string;
    data: {
        accessToken: string;
        refreshToken: string;
        _id: string;
        email: string;
        fullName: string;
        phone: string;
        roleName: string;
        parentId: string | null;
        createdAt: string;
        updatedAt: string;
    };
}