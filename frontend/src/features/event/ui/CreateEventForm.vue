<script setup lang="ts">
    import { ICity } from '@/features/dictionary/types/city.interface';
    interface CreateEventFormProps {
        cities: ICity[];
    }
    const props = defineProps<CreateEventFormProps>();

    const areas = [
        { name: 'ИТ' },
        { name: 'Биг Дата' },
        { name: 'Дизайн' },
        { name: 'Аналитика' },
        { name: 'Информационная безопасность' },
    ];
</script>

<template>
    <div class="flex flex-col min-w-0 gap-4">
        <h2 class="font-semibold text-2xl">Создание мероприятия</h2>
        <div class="flex flex-col gap-3 w-400px">
            <div class="flex gap-2 justify-between w-full">
                <label for="startDate" class="p-1 pl-0">Начало</label>
                <input
                    id="startDate"
                    name="startDate"
                    class="border border-solid p-1"
                    type="date"
                />
            </div>
            <div class="flex gap-2 justify-between w-full">
                <label for="endDate" class="p-1 pl-0">Окончание</label>
                <input id="endDate" name="endDate" class="border border-solid p-1" type="date" />
            </div>
            <div class="flex gap-2 justify-between w-full">
                <label for="name" class="p-1 pl-0">Название</label>
                <input
                    :placeholder="`Курс по оформлению и формированию ТЗ для чайников`"
                    id="name"
                    name="name"
                    class="border border-solid p-1"
                    type="text"
                />
            </div>
            <div class="flex gap-2 justify-between w-full">
                <label for="area" class="p-1 pl-0">Направление</label>
                <select name="area" id="area">
                    <option
                        class="text-end"
                        v-for="area in areas"
                        :key="area.name"
                        :value="area.name"
                    >
                        {{ area.name }}
                    </option>
                </select>
            </div>
            <div class="flex gap-2 justify-between w-full">
                <label for="city" class="p-1 pl-0">Город</label>
                <select name="city" id="city">
                    <option
                        class="text-end"
                        v-for="city in cities"
                        :key="city.id"
                        :value="city.name"
                    >
                        {{ city.name }}
                    </option>
                </select>
            </div>
        </div>
    </div>
</template>

<style scoped lang="css"></style>
