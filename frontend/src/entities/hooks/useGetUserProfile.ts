import { useUserInfo } from '@/entities/user/model/useUserInfo';
import { userService } from '../user/services/user.service';
import { useQuery } from '@tanstack/vue-query';

export function useGetUserProfile(enabled = true) {
	const userInfo = useUserInfo();

	return useQuery({
		queryKey: ['user', 'profile'],
		queryFn: async () => {
			const profile = await userService.getProfile();

			userInfo.setUser({
				...profile,
				accessToken: userInfo.accessToken.value,
			});

			return profile;
		},
		enabled,
		staleTime: 1000 * 60 * 5, // 5 минут
		retry: false,
	});
}
