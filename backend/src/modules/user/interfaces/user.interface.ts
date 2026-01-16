import { UserRole } from 'src/enums/enums';

export interface IUser {
  id: string;
  role: UserRole | null;
  email: string;
  password: string;
  name?: string | null;
  birthDate?: Date | null;
  areaId?: string | null;
  sex?: 'м' | 'ж' | null;
  photo?: string | null;
  countryId?: string | null;
  phone?: string | null;
  //   createdAt?: Date;
  //   updatedAt?: Date;
}

// export interface IUserWithPassword extends IUser {
//   password: string;
// }

// export interface IUserResponse extends IUser {
//   displayName: string;
// }

export interface IUserPaginatedResponse {
  data: IUser[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
