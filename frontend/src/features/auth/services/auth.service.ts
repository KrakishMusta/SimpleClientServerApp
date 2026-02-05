import { api } from '@/shared/api/instance.api';
import { IRegisterForm } from '../types/register.types';
import { ILoginForm } from '../types/login.type';
import { ITokens } from '../types/tokens.type';

class AuthService {
	public async register(body: IRegisterForm) {
		const response = await api.post('auths/register', body);

		return response;
	}

	public async login(body: ILoginForm) {
		const response = await api.post('auths/login', body);

		return response;
	}

	public async refreshTokens(): Promise<ITokens> {
		console.log(`refresh refreshTokens`);
		const response = await api.post<ITokens>(
			'auths/refresh',
			{}, // тело запроса пустое
			{ withCredentials: true }, // <-- конфиг axios
		);

		return response;
	}

	public async logout(): Promise<void> {
		await api.post('auths/logout');
	}
}

export const authService = new AuthService();
