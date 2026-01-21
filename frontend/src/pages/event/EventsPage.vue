<script setup lang="ts">
    import { useGetEvents } from '@/features/event/hooks/useGetEvents';
    import { computed } from 'vue';
    import { useRoute } from 'vue-router';

    const { data, isLoading, isError } = useGetEvents();
    const route = useRoute();

    const events = computed(() => data.value ?? []);

    const hideParent = computed(() => route.meta.hideParent);
</script>

<template>
    <div class="p-10 flex min-w-0 w-full h-full box-border">
        <div v-if="!hideParent">
            <router-link to="/events/create-event">
                <button type="button" class="p-2 text-xl rounded-sm bg-slate-400">
                    Создать мероприятие
                </button>
            </router-link>

            <div v-if="isLoading">Загрузка...</div>
            <div v-if="!events.length">Доступных мероприятий нет.</div>
            <!-- <div></div> -->
        </div>
        <router-view class="w-full min-w-0" v-slot="{ Component }">
            <component :is="Component" />
        </router-view>
    </div>
</template>

<style scoped lang="css"></style>
