export interface GetNotificationsResponse {
    code: number;
    result: Notification[];
}

export interface Notification {
    id: string;
    title: string;
    content: string;
    type: string;
    senderId: string;
    createdAt: string;
    readAt: string | null;
    deliveredAt: string;
    global: boolean;
    read: boolean;
}
    