import { api } from '@/shared/api/instance.api';
import { ICity } from '../types/city.interface';
import { IArea } from '../types/area.interface';

class DictionaryService {
    async getCityDictionary(): Promise<ICity[]> {
        const response = await api.get<ICity[]>('cities/', {
            withCredentials: true,
        });
        return response;
    }
    async getAreaDictionary(): Promise<IArea[]> {
        const response = await api.get<IArea[]>('areas/', {
            withCredentials: true,
        });
        return response;
    }
}

export const dictionaryService = new DictionaryService();
