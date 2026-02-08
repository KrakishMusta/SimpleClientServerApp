import { reactive, computed } from 'vue';
import { IUserInfo } from '../types/user.types';
import { ITokens } from '@/features/auth/types/tokens.type';

const state = reactive({
	user: {} as IUserInfo,
	isLoggedIn: false,
});

const accessToken = computed(() => state.user.accessToken);
const userId = computed(() => state.user.id);

export function useUserInfo() {
	function setUser(user: IUserInfo) {
		state.user = user;
		state.isLoggedIn = !!user?.accessToken;
	}

	function setAccessToken(tokens: ITokens) {
		console.log(tokens);
		state.user.accessToken = tokens.accessToken || null;
		state.isLoggedIn = !!tokens;
	}

	function logout() {
		state.user = {} as IUserInfo;
		state.isLoggedIn = false;
	}

	return {
		user: state.user,
		isLoggedIn: computed(() => state.isLoggedIn),
		accessToken,
		userId,
		setUser,
		setAccessToken,
		logout,
	};
}
