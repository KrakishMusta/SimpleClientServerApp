<script setup lang="ts">
	import { useGetEvents } from '@/features/event/hooks/useGetEvents';
	import { formatDateForInput, formatDateHuman } from '@/shared/utils/formatDate';
	import { computed } from 'vue';
	import { useRoute } from 'vue-router';

	const { data, isLoading, isError } = useGetEvents();
	const route = useRoute();

	const events = computed(() => data.value ?? []);

	const hideParent = computed(() => route.meta.hideParent);
</script>

<template>
	<div class="p-10 flex w-full box-border overflow-y-auto h-full">
		<div class="flex flex-col gap-8 min-w-0 w-full h-full min-h-0" v-if="!hideParent">
			<router-link to="/events/create-event">
				<button type="button" class="p-2 text-xl rounded-sm bg-slate-400">
					Создать мероприятие
				</button>
			</router-link>

			<div v-if="isLoading">Загрузка...</div>
			<div v-if="!events.length">Доступных мероприятий нет.</div>
			<div v-else class="flex gap-2">
				<div class="bg-slate-300 rounded-lg w-1/3 box-border p-4" v-for="event in events">
					<h2
						class="text-xl max-w-full overflow-hidden text-ellipsis whitespace-nowrap align-bottom inline-block"
					>
						Мероприятие
						<span class="font-bold"> "{{ event.title }}" </span>
					</h2>
					<div class="flex flex-col text base">
						<span>{{ event.area.name }}</span>
						<span>{{ event.city.name }}</span>
					</div>
					<div class="flex pl-2 flex-col text-base">
						<span>Начало: {{ formatDateHuman(event.startDate) }}</span>
						<span>Окончание: {{ formatDateHuman(event.endDate) }}</span>
					</div>
				</div>
			</div>
			<!-- <div></div> -->
		</div>
		<router-view class="w-full min-w-0 min-h-0 h-full" v-slot="{ Component }">
			<component :is="Component" />
		</router-view>
	</div>
</template>

<style scoped lang="css"></style>
