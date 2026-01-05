export interface JwtPayload {
    sub: number; // user id
    email: string;
    username: string;
    role: string;
}

export interface Tokens {
    accessToken: string;
    refreshToken: string;
}
