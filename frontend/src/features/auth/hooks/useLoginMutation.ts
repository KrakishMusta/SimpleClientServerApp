import { useRouter } from 'vue-router';
import { useMutation } from '@tanstack/vue-query';
import { ILoginForm } from '../types/login.type';
import { ITokens } from '../types/tokens.type';
import { authService } from '../services/auth.service';
import { useUserInfo } from '@/entities/user/model/useUserInfo';
import { useGetUserProfile } from '@/entities/hooks/useGetUserProfile';

export function useLoginMutation() {
	const router = useRouter();
	const userInfo = useUserInfo();
	const { refetch } = useGetUserProfile(false);

	const { mutate: login, isPending } = useMutation({
		mutationKey: ['login user'],
		mutationFn: async ({ values }: { values: ILoginForm }) => {
			return await authService.login(values);
		},
		onSuccess: async (tockens: ITokens) => {
			userInfo.setAccessToken(tockens);

			await refetch();
			console.log('login response', tockens);
			router.push({ name: 'events' });
		},
		onError(error) {
			console.error(error);
		},
	});

	return { login, isPending };
}
