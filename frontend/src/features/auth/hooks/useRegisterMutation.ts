import { useRouter } from 'vue-router';
import { useMutation } from '@tanstack/vue-query';
import { IRegisterForm } from '../types/register.types';
import { authService } from '../services/auth.service';

export function useRegisterMutation() {
	const router = useRouter();
	const { mutate: register, isPending: isLoadingRegister } = useMutation({
		mutationKey: ['register user'],
		mutationFn: async ({ values }: { values: IRegisterForm }) => {
			console.log('register user', values);
			return await authService.register(values);
		},
		onSuccess(data: any) {
			console.log('register response', data);
			router.push({ name: 'login' });
		},
		onError(error) {
			console.log(error);
		},
	});

	return { register, isLoadingRegister };
}
