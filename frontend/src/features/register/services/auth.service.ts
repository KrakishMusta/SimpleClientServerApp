import { api } from '@/shared/api/instance.api';
import { IRegisterForm } from '../types/register.types';

class AuthService {
    public async register(body: IRegisterForm) {
        const response = await api.post('auth/register', body);

        return response;
    }

    // public async login(body: TypeLoginSchema, recaptcha?: string) {
    //     try {
    //         const userInfo = useUserInfo();
    //         const headers = recaptcha ? { recaptcha } : undefined;

    //         const response = await api.post<Object>('auth/login', body, {
    //             headers,
    //         });

    //         const userData = { ...response, method: 'CREDENTIALS' };

    //         userInfo.updateUser(userData);

    //         return response;
    //     } catch (error: any) {
    //         toastMessageHandler(error);
    //     }
    // }
    // public async initLogin(body: TypeLoginSchema, recaptcha?: string) {
    //     try {
    //         const userInfo = useUserInfo();
    //         const headers = recaptcha ? { recaptcha } : undefined;

    //         console.log(body);

    //         const response = await api.post<Object>('auth/email-confirmation', body, {
    //             headers,
    //         });

    //         const userData = { ...response, method: 'CREDENTIALS' };

    //         userInfo.updateUser(userData);

    //         return response;
    //     } catch (error: any) {
    //         toastMessageHandler(error);
    //     }
    // }

    // public async oauthByProvider(provider: 'google' | 'yandex') {
    //     const userInfo = useUserInfo();
    //     const response = await api.get<{ url: string }>(`auth/oauth/connect/${provider}`);

    //     console.log(response);
    //     // debugger;
    //     return response;
    // }

    // public async checkSession() {
    //     const response = await api.get<any>('/auth/check-session');

    //     return response;
    // }

    // public async logout() {
    //     const response = await api.post('auth/logout');
    //     return response;
    // }
}

export const authService = new AuthService();
