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

	function setAccessToken(token: ITokens) {
		console.log(token);
		state.user.accessToken = token.accessToken || null;
		state.isLoggedIn = !!token;
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
