import { AxiosClient } from './axios-client';

export const __API__ =
	import.meta.env.VITE_ENV === 'development'
		? 'http://localhost:3000'
		: import.meta.env.VITE_PUBLIC_SERVER_URL;

export const api = new AxiosClient({
	baseUrl: __API__,
	options: {
		credentials: 'include', // куки
	},
});
