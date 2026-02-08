import { reactive, computed, ref } from 'vue';
import { IUserInfo } from '../types/user.types';
import { ITokens } from '@/features/auth/types/tokens.type';

const state = reactive({
	user: {} as IUserInfo,
	isLoggedIn: false,
});

const isAuthReady = ref(false);

const accessToken = computed(() => state.user.accessToken);
const userId = computed(() => state.user.id);

export function useUserInfo() {
	function setUser(user: IUserInfo) {
		Object.assign(state.user, user);
		state.isLoggedIn = !!user?.accessToken;
		isAuthReady.value = true; // авторизация завершена
	}

	function setAccessToken(tokens: ITokens | null) {
		state.user.accessToken = tokens?.accessToken || null;
		state.isLoggedIn = !!tokens?.accessToken;
		isAuthReady.value = true; // авторизация завершена (даже если токена нет)
	}

	function logout() {
		Object.keys(state.user).forEach((key) => delete state.user[key]);
		state.isLoggedIn = false;
		isAuthReady.value = true; // авторизация завершена после логаута
	}

	return {
		user: state.user,
		isLoggedIn: computed(() => state.isLoggedIn),
		accessToken,
		userId,
		isAuthReady,
		setUser,
		setAccessToken,
		logout,
	};
}
