import { api } from '@/shared/api/instance.api';
import { ICity } from '../types/city.interface';

class DictionaryService {
    async getCityDictionary(): Promise<ICity[]> {
        const response = await api.get<ICity[]>('cities/', {
            withCredentials: true,
        });
        return response;
    }
}

export const eventService = new DictionaryService();
