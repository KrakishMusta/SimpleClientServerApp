<script setup lang="ts">
    import { useGetAreaDictionary } from '@/features/dictionary/hooks/useGetAreaDictionary';
    import { useGetCityDictionary } from '@/features/dictionary/hooks/useGetCityDictionary';
    import CreateEventForm from '@/features/event/ui/CreateEventForm.vue';
    import { computed } from 'vue';

    const { data: cityDictionary } = useGetCityDictionary();
    const { data: areaDictionary } = useGetAreaDictionary();

    const cities = computed(() => cityDictionary.value ?? []);
    const areas = computed(() => areaDictionary.value ?? []);
</script>

<template>
    <div class="flex flex-col items-center">
        <!-- <pre class="break-wordsmin-w-0 max-w-full overflow-x-auto">{{ cities.slice(10) }}</pre> -->
        <CreateEventForm :cities="cities" :areas="areas" />
    </div>
</template>

<style scoped lang="css"></style>
