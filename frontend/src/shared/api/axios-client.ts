import axios, { AxiosHeaders, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

import { FetchError } from './axios-error';
import { RequestOptions, TypeSearchParams } from './axios-types';
import { useUserInfo } from '@/entities/user/model/useUserInfo';

interface AxiosRequestOptions extends Omit<AxiosRequestConfig, 'url' | 'method'> {
	params?: TypeSearchParams;
}

export class AxiosClient {
	private instance: AxiosInstance;

	public constructor(init: {
		baseUrl: string;
		headers?: Record<string, string>;
		params?: TypeSearchParams;
		options?: RequestOptions;
	}) {
		this.instance = axios.create({
			baseURL: init.baseUrl,
			headers: init.headers,
			params: init.params,
			...(init.options as AxiosRequestConfig),
			withCredentials: true,
		});

		// --- Перехватчик запроса для accessToken ---
		this.instance.interceptors.request.use((config) => {
			const userInfo = useUserInfo();
			const token = userInfo.accessToken.value; // <-- теперь токен всегда актуален
			if (token) {
				if (!config.headers) config.headers = new AxiosHeaders();
				(config.headers as AxiosHeaders).set('Authorization', `Bearer ${token}`);
			}
			return config;
		});

		// --- Перехватчик ошибок ---
		this.instance.interceptors.response.use(
			(response) => response,
			(error) => {
				if (error.response) {
					throw new FetchError(
						error.response.status,
						error.response.data?.message || error.response.statusText,
					);
				} else if (error.request) {
					throw new FetchError(0, 'No response from server');
				} else {
					throw new FetchError(0, error.message);
				}
			},
		);
	}

	private async request<T>(
		endpoint: string,
		method: AxiosRequestConfig['method'],
		options: AxiosRequestOptions = {},
	): Promise<T> {
		const config: AxiosRequestConfig = {
			url: endpoint,
			method,
			...options,
		};

		const response: AxiosResponse<T> = await this.instance.request<T>(config);
		return response.data;
	}

	public get<T>(endpoint: string, options: AxiosRequestOptions = {}) {
		return this.request<T>(endpoint, 'GET', options);
	}

	public post<T>(
		endpoint: string,
		body?: Record<string, any>,
		options: AxiosRequestOptions = {},
	) {
		return this.request<T>(endpoint, 'POST', { ...options, data: body });
	}

	public put<T>(endpoint: string, body?: Record<string, any>, options: AxiosRequestOptions = {}) {
		return this.request<T>(endpoint, 'PUT', { ...options, data: body });
	}

	public delete<T>(endpoint: string, options: AxiosRequestOptions = {}) {
		return this.request<T>(endpoint, 'DELETE', options);
	}

	public patch<T>(
		endpoint: string,
		body?: Record<string, any>,
		options: AxiosRequestOptions = {},
	) {
		return this.request<T>(endpoint, 'PATCH', { ...options, data: body });
	}
}
