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
	<div class="p-10 flex w-full box-border h-svh min-h-0">
		<div class="flex flex-col gap-8 min-w-0 w-full h-full min-h-0" v-if="!hideParent">
			<router-link
				class="select-none self-start col-span-4 text-center font-semibold bg-slate-100 p-2 w-fit text-xl rounded-sm hover:bg-slate-400 cursor-pointer"
				to="/events/create-event"
			>
				Создать мероприятие
			</router-link>

			<div v-if="isLoading">Загрузка...</div>
			<div v-if="!events.length && !isLoading">Доступных мероприятий нет.</div>
			<div
				class="grid grid-cols-1 md:grid-cols-3 gap-4 overflow-auto min-w-0 w-full h-full min-h-0"
			>
				<div
					@click="() => $router.push({ name: 'event', params: { eventId: event.id } })"
					class="bg-slate-400 rounded-lg p-4 hover:bg-slate-200 hover:shadow-[0_10px_0_rgba(0,0,1,0.2)] cursor-pointer"
					v-for="event in events"
					:key="event.id"
				>
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
		<router-view class="flex flex-col w-full min-w-0 min-h-0 h-full" v-slot="{ Component }">
			<component :is="Component" />
		</router-view>
	</div>
</template>

<style scoped lang="css"></style>
