import { useRouter } from 'vue-router';
import { useMutation } from '@tanstack/vue-query';
import { ILoginForm } from '../types/login.type';
import { ITokens } from '../types/tokens.type';
import { authService } from '../services/auth.service';
import { useUserInfo } from '@/entities/user/model/useUserInfo';

export function useLogoutMutation() {
	const router = useRouter();
	const userInfo = useUserInfo();

	const { mutate: logout, isPending } = useMutation({
		mutationKey: ['login user'],
		mutationFn: async () => {
			return await authService.logout();
		},
		onSuccess() {
			userInfo.logout();
			console.log('logout response');
			router.push('/auth/login');
		},
		onError(error) {
			console.error(error);
		},
	});

	return { logout, isPending };
}
