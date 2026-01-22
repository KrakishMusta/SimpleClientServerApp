import { useQuery } from '@tanstack/vue-query';
import { dictionaryService } from '../services/dictionary.service';
import { IArea } from '../types/area.interface';

export function useGetAreaDictionary() {
    return useQuery<IArea[]>({
        queryKey: ['get areas'],

        queryFn: async () => {
            return await dictionaryService.getAreaDictionary();
        },
    });
}
