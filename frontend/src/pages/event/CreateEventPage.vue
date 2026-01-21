<script setup lang="ts">
    import { useGetCityDictionary } from '@/features/dictionary/hooks/useGetCityDictionary';
    import CreateEventForm from '@/features/event/ui/CreateEventForm.vue';
    import { computed } from 'vue';

    const { data } = useGetCityDictionary();

    const cities = computed(() => data.value ?? []);
</script>

<template>
    <div class="flex flex-col items-center">
        <!-- <pre class="break-wordsmin-w-0 max-w-full overflow-x-auto">{{ cities.slice(10) }}</pre> -->
        <CreateEventForm :cities="cities" />
    </div>
</template>

<style scoped lang="css"></style>
