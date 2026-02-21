export type Role = 'customer' | 'agent' | 'admin';

export interface User {
    id: string;
    email: string;
    username: string;
    name: string;
    role: Role;
    createdAt?: string;
}

export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type Status = 'open' | 'in-progress' | 'resolved' | 'closed';

export interface Ticket {
    id: string;
    title: string;
    description: string;
    status: Status;
    priority: Priority;
    tags: string[];
    ownerId: string;
    ownerName?: string;
    assigneeId?: string;
    assigneeName?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Comment {
    id: string;
    ticketId: string;
    authorId: string;
    content: string;
    isInternal: boolean;
    createdAt: string;
    authorName: string;
    authorRole: Role;
}

export interface AuthResponse {
    user: User;
    token: string;
}
