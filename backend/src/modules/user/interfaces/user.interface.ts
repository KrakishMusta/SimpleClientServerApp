export interface IUser {
    id: number;
    email: string;
    username: string;
    role: string;
    isEmailVerified: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IUserWithPassword extends IUser {
    password: string;
}

export interface IUserResponse extends IUser {
    displayName: string;
}

export interface IUserPaginatedResponse {
    data: IUserResponse[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
