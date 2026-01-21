import { useQuery } from '@tanstack/vue-query';
import { ICity } from '../types/city.interface';
import { eventService } from '../services/dictionary.service';

export function useGetCityDictionary() {
    return useQuery<ICity[]>({
        queryKey: ['get cities'],

        queryFn: async () => {
            return await eventService.getCityDictionary();
        },
    });
}
