import { useMutation } from '@tanstack/vue-query';
import { authService } from '../services/auth.service';
import { useUserInfo } from '@/entities/user/model/useUserInfo';
import { useGetUserProfile } from '@/entities/hooks/useGetUserProfile';

export function useInitAuthMutation() {
	const userInfo = useUserInfo();

	const { refetch } = useGetUserProfile(false);

	const { mutate: initAuth, isPending } = useMutation({
		mutationKey: ['initAuth'],
		mutationFn: async () => {
			// Сервер проверяет httpOnly cookie и возвращает новый accessToken
			console.log(`refresh initAuth`);
			const tokens = await authService.refreshTokens();
			return tokens;
		},
		onSuccess: async (tokens) => {
			userInfo.setAccessToken(tokens);

			await refetch();

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
