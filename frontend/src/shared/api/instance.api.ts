import axios from 'axios';

import { AxiosClient } from './axios-client';

export const __API__ = import.meta.env.VITE_PUBLIC_SERVER_URL;

export const api = new AxiosClient({
    baseUrl: import.meta.env.VITE_PUBLIC_SERVER_URL,
    options: {
        credentials: 'include',
    },
});

export const $api = axios.create({
    baseURL: import.meta.env.VITE_PUBLIC_SERVER_URL,
    withCredentials: true,
});
