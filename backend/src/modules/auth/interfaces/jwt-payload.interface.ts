export interface JwtPayload {
  sub: string; // user id
  email: string;
  name?: string | null;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}
