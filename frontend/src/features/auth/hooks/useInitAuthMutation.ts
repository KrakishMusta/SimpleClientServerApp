import { useMutation } from '@tanstack/vue-query';
import { authService } from '../services/auth.service';
import { useUserInfo } from '@/entities/user/model/useUserInfo';

export function useInitAuthMutation() {
	const userInfo = useUserInfo();

	const { mutate: initAuth, isPending } = useMutation({
		mutationKey: ['initAuth'],
		mutationFn: async () => {
			// Сервер проверяет httpOnly cookie и возвращает новый accessToken
			const tokens = await authService.refreshTokens();
			return tokens;
		},
		onSuccess(tokens) {
			// Сохраняем accessToken в память приложения
			userInfo.setAccessToken(tokens);
			console.log('success auth init', tokens);
		},
		onError() {
			// Если refreshToken отсутствует или недействителен
			userInfo.setAccessToken(null);
			console.log('User is not logged in');
		},
	});

	return { initAuth, isPending };
}
