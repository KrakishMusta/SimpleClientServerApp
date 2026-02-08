<script setup lang="ts">
	import { useGetEvent } from '@/features/event/hooks/useGetEvent';
	import { formatDateHuman, parseDateFromInput } from '@/shared/utils/formatDate';
	import { useRoute } from 'vue-router';

	const route = useRoute();

	const eventId = route.params.eventId as string;

	const { data: event, isLoading, error } = useGetEvent(eventId);
</script>

<template>
	<div class="gap-4">
		<span v-if="isLoading">Загрузка мероприятия...</span>
		<span v-else-if="!isLoading && error"></span>
		<div v-else class="flex flex-col gap-4">
			<router-link
				class="select-none self-start col-span-4 text-center font-semibold bg-slate-400 p-2 w-fit text-xl rounded-sm hover:bg-slate-400/10 cursor-pointer"
				to="/events"
				>К мероприятиям</router-link
			>
			<!-- <pre>{{ event }}</pre> -->
			<div class="flex gap-8 items-center max-md:justify-between">
				<h1 class="text-5xl font-semibold">{{ event.title }}</h1>
				<div class="flex flex-col">
					<span class="flex items-center gap-2">
						<h2 class="text-3xl">г. {{ event.cityName }}</h2>
						<span class="text-3xl"> – </span>
						<h2 class="text-3xl">{{ event.areaName }}</h2>
					</span>
					<p>
						Продолжительность дней:
						<span class="text-xl font-semibold">{{ event.durationDays }}</span>
					</p>
					<p>
						Начало:
						{{ formatDateHuman(event.startDate) }} в
						<span
							v-if="Object.keys(event.activitiesByDay).length"
							class="text-xl font-semibold"
							>{{
								event.activitiesByDay[
									new Date(event.startDate).toISOString().split('T')[0]
								][0].start
							}}</span
						>
						<span
							class="underline decoration-2 underline-offset-4 decoration-slate-100"
							v-else
							>нет данных</span
						>
					</p>
					<p>Конец: {{ formatDateHuman(event.endDate) }}</p>
				</div>
				<!-- <div class="flex flex-col"></div> -->
			</div>
			<span class="w-full bg-slate-400 h-px"></span>
			<div class="md:w-175 flex flex-col items-center min-h-0 h-full self-center">
				<div class="grid grid-cols-[1fr_1fr_1fr_34px] gap-2 font-semibold w-full">
					<div class="flex items-center">Наименование</div>
					<div class="flex justify-center items-center">Начало</div>
					<div class="flex justify-center items-center">Жюри</div>
					<div class="size-8.5"></div>
				</div>
				<div
					v-if="Object.keys(event.activitiesByDay).length"
					class="flex flex-col gap-2 min-h-0 h-full overflow-y-auto scrollbar-custom w-full"
				>
					<div
						v-for="([day, dayActivities], index) in Object.entries(
							event.activitiesByDay,
						)"
						:key="day"
						class="flex flex-col gap-2"
					>
						<!-- Заголовок дня -->
						<div
							class="col-span-4 flex gap-2 box-border border border-slate-100 justify-center font-semibold p-1 rounded select-none"
						>
							<span>День {{ index + 1 }} – {{ formatDateHuman(day) }}</span>
						</div>

						<!-- Активности дня -->
						<!-- <pre>{{ dayActivities }}</pre> -->
						<div
							v-for="(activity, index) in dayActivities"
							:key="activity.id"
							class="group flex flex-col gap-1 border-b border-b-slate-200"
						>
							<div class="grid grid-cols-[1fr_1fr_1fr_34px] gap-2 items-center">
								<p>{{ activity.title }}</p>

								<p class="text-center">{{ activity.start }}</p>

								<span class="text-center">{{
									activity.jury?.length ? activity.jury.length : 'Не назначены'
								}}</span>
							</div>

							<div
								class="group-hover:flex hidden col-span-4 justify-center relative select-none"
							>
								<span
									class="bg-slate-400 z-0 left-0 self-center h-px w-full absolute"
								></span>
							</div>
						</div>
					</div>
				</div>
				<p v-else>Активности... отсутствуют?</p>
			</div>
		</div>
	</div>
</template>

<style scoped lang="css"></style>
