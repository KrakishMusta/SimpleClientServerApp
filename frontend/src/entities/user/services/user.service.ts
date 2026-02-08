import { api } from '@/shared/api/instance.api';
import { IUserInfo } from '../types/user.types';

class UserService {
	async getProfile(): Promise<Omit<IUserInfo, 'accessToken'>> {
		return api.get('auths/profile');
	}
}

export const userService = new UserService();
