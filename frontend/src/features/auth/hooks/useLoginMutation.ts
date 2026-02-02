import { useRouter } from 'vue-router';
import { useMutation } from '@tanstack/vue-query';
import { ILoginForm } from '../types/login.type';
import { ITokens } from '../types/tokens.type';
import { authService } from '../services/auth.service';
import { useUserInfo } from '@/entities/user/model/useUserInfo';

export function useLoginMutation() {
	const router = useRouter();
	const userInfo = useUserInfo();

	const { mutate: login, isPending } = useMutation({
		mutationKey: ['login user'],
		mutationFn: async ({ values }: { values: ILoginForm }) => {
			return await authService.login(values);
		},
		onSuccess(data: ITokens) {
			userInfo.setAccessToken(data);
			console.log('login response', data);
			router.push({ name: 'events' });
		},
		onError(error) {
			console.error(error);
		},
	});

	return { login, isPending };
}
