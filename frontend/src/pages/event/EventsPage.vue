<script setup lang="ts">
	import { useUserInfo } from '@/entities/user/model/useUserInfo';
	import { useGetEvents } from '@/features/event/hooks/useGetEvents';
	import { formatDateForInput, formatDateHuman } from '@/shared/utils/formatDate';
	import { computed } from 'vue';
	import { useRoute } from 'vue-router';

	const { data, isLoading, isError } = useGetEvents();
	const route = useRoute();

	const events = computed(() => data.value ?? []);
	const userInfo = useUserInfo();

	const hideParent = computed(() => route.meta.hideParent);
</script>

<template>
	<div>
		<div class="flex flex-col gap-8 min-w-0 w-full h-full min-h-0" v-if="!hideParent">
			<router-link
				v-if="userInfo.isLoggedIn.value"
				class="select-none self-start col-span-4 text-center font-semibold bg-slate-400 p-2 w-fit text-xl rounded-sm hover:bg-slate-400/10 cursor-pointer"
				to="/events/create-event"
			>
				Создать мероприятие
			</router-link>

			<div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div v-for="i in 6" :key="i" class="h-40 bg-slate-200 animate-pulse rounded-2xl" />
			</div>
			<div v-if="!events.length && !isLoading">Доступных мероприятий нет.</div>
			<div v-else class="overflow-y-auto scrollbar-custom min-w-0 w-full h-full min-h-0">
				<div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
					<div
						v-for="event in events"
						:key="event.id"
						@click="$router.push({ name: 'event', params: { eventId: event.id } })"
						class="group relative bg-white rounded-2xl p-5 box-border border border-slate-200 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-slate-800 cursor-pointer"
					>
						<!-- Цветной акцент -->
						<span
							class="absolute -left-px top-0 h-full w-1 rounded-l-2xl bg-indigo-500 group-hover:bg-indigo-600 transition"
						></span>

						<!-- Заголовок -->
						<h2
							class="text-lg font-semibold text-slate-800 truncate pr-4"
							:title="event.title"
						>
							{{ event.title }}
						</h2>

						<!-- Локация -->
						<div class="mt-2 text-sm text-slate-500 flex flex-col gap-0.5">
							<span>{{ event.area.name }}</span>
							<span>{{ event.city.name }}</span>
						</div>

						<!-- Даты -->
						<div class="mt-4 text-sm text-slate-700 flex flex-col gap-1">
							<span class="flex gap-2">
								<span class="font-medium">Начало:</span>
								<span>{{ formatDateHuman(event.startDate) }}</span>
							</span>
							<span class="flex gap-2">
								<span class="font-medium">Окончание:</span>
								<span>{{ formatDateHuman(event.endDate) }}</span>
							</span>
						</div>
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
