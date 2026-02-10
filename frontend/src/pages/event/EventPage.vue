<script setup lang="ts">
	import { useUserInfo } from '@/entities/user/model/useUserInfo';
	import { useGetAreaDictionary } from '@/features/dictionary/hooks/useGetAreaDictionary';
	import { useGetCityDictionary } from '@/features/dictionary/hooks/useGetCityDictionary';
	import { useGetEvent } from '@/features/event/hooks/useGetEvent';
	import { useUpdateEventMutation } from '@/features/event/hooks/useUpdateEventMutation';
	import { IActivityRecord, IEvent } from '@/features/event/types/event.types';
	import EventFormBase from '@/features/event/ui/EventFormBase.vue';
	import EventTitle from '@/features/event/ui/EventTitle.vue';
	import { formatDateHuman, parseDateFromInput } from '@/shared/utils/formatDate';
	import { computed, ref, watch } from 'vue';
	import { useRoute } from 'vue-router';

	const userInfo = useUserInfo();

	const route = useRoute();

	const isEditMode = ref(false);

	const eventId = route.params.eventId as string;

	const { data: event, isLoading, error } = useGetEvent(eventId);

	const editableEvent = ref<IEvent | null>(null);
	const originalActivities = ref<IActivityRecord[]>([]);

	const formRef = ref<InstanceType<typeof EventFormBase>>();

	const firstKey = ref<string>(``);

	const { mutate: updateEvent } = useUpdateEventMutation();

	const { data: cityDictionary } = useGetCityDictionary();
	const { data: areaDictionary } = useGetAreaDictionary();

	const cities = computed(() => cityDictionary.value ?? []);
	const areas = computed(() => areaDictionary.value ?? []);

	function diffActivities(oldList: IActivityRecord[], newList: IActivityRecord[]) {
		const oldMap = new Map(oldList.map((a) => [a.id, a]));
		const newMap = new Map(newList.filter((a) => a.id).map((a) => [a.id, a]));

		const added = newList.filter((a) => !a.id);
		const removed = oldList.filter((a) => !newMap.has(a.id));
		const updated = newList.filter(
			(a) => a.id && JSON.stringify(a) !== JSON.stringify(oldMap.get(a.id)),
		);

		return { added, removed, updated };
	}

	function handleSave() {
		formRef.value.syncParent();
		const { added, removed, updated } = diffActivities(
			originalActivities.value,
			editableEvent.value.activities,
		);
		console.log(`handleSave`, editableEvent.value);
		console.group(`PAYLOAD`);
		console.log(`added`, added);
		console.log(`removed`, removed);
		console.log(`updated`, updated);
		console.groupEnd();
		updateEvent(event.value.id, {
			title: editableEvent.value.title,
			city: editableEvent.value.cityId,
			startDate: editableEvent.value.startDate,
			activitiesDiff: {
				added,
				removed: removed.map((a) => a.id),
				updated,
			},
		});
	}

	watch(
		event,
		(e) => {
			console.log(`event`, e);
			if (e) {
				console.log(e.activitiesByDay);
				editableEvent.value = JSON.parse(JSON.stringify(e));
				originalActivities.value = JSON.parse(JSON.stringify(e.activities)) ?? [];
				firstKey.value = Object.keys(event.value.activitiesByDay)[0];
				console.log(`initeditableEvent`, editableEvent.value);
				console.log(`initoriginalActivities`, originalActivities.value);
				console.log(`firstKey`, Object.keys(event.value.activitiesByDay)[0]);
			}
		},
		{ immediate: true },
	);

	watch(
		() => editableEvent.value?.title,
		(newTitle, oldTitle) => {
			console.log('title changed:', oldTitle, '->', newTitle);
		},
	);

	watch(
		() => editableEvent.value,
		(newVal, oldVal) => {
			console.log('changed:', oldVal, '->', newVal);
		},
	);
</script>

<template>
	<div class="gap-4">
		<!-- <pre>{{ event.activitiesByDay }}</pre> -->
		<!-- {{ userInfo.isAuthReady }}
		{{ eventId }} -->
		<span v-if="isLoading">Загрузка мероприятия...</span>
		<span v-else-if="!isLoading && error">Ошибка загрузки</span>
		<div
			v-else-if="event && firstKey && event.activitiesByDay[firstKey]?.length"
			class="flex flex-col gap-4 min-h-0 min-w-0 h-full w-full"
		>
			<div class="flex justify-between items-center">
				<router-link
					class="select-none self-start col-span-4 text-center font-semibold bg-slate-400 p-2 w-fit text-xl rounded-sm hover:bg-slate-400/10 cursor-pointer"
					to="/events"
					>К мероприятиям</router-link
				>
				<button
					class="cursor-pointer p-2 hover:border-slate-100 hover:border box-border"
					v-if="event.isOrganizer"
					@click="isEditMode = !isEditMode"
				>
					{{ isEditMode ? 'Режим просмотра' : 'Редактировать' }}
				</button>

				<!-- {{ event.isOrganizer }} -->

				<!-- {{ event.creatorId }} -->

				<!-- {{ userInfo.userId || `null` }} -->

				<!-- <pre>{{ userInfo }}</pre> -->
				<!-- <pre>{{ event. }}</pre> -->
			</div>

			<div v-if="!isEditMode" class="flex flex-col gap-4 min-h-0 min-w-0 h-full w-full">
				<div class="flex gap-8 items-center max-md:justify-between">
					<h1 class="text-5xl font-semibold">{{ event.title }}</h1>
					<div class="flex flex-col">
						<span class="flex items-center gap-2">
							<h2 class="text-3xl text-nowrap">г. {{ event.cityName }}</h2>
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

							<!-- {{ firstKey || 1 }}
							{{ event.activitiesByDay[firstKey] || 1 }} -->

							<span
								v-if="Object.keys(event.activitiesByDay).length"
								class="text-xl font-semibold"
								>{{ event.activitiesByDay[firstKey][0].start }}</span
							>
							<span
								class="underline decoration-2 underline-offset-4 decoration-slate-100"
								v-else
								>нет данных</span
							>
						</p>
						<p>Конец: {{ formatDateHuman(event.endDate) }}</p>
					</div>
				</div>
				<span class="w-full bg-slate-400 h-px"></span>
				<div class="md:w-175 flex flex-col items-center min-h-0 h-full self-center">
					<div class="grid grid-cols-[1fr_1fr_1fr] gap-2 py-4 font-semibold w-full">
						<div class="flex items-center">Наименование</div>
						<div class="flex justify-center items-center">Начало</div>
						<div class="flex justify-center items-center">Жюри</div>
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
							<div
								class="col-span-4 flex gap-2 box-border border border-slate-100 justify-center font-semibold p-1 rounded select-none"
							>
								<span>День {{ index + 1 }} – {{ formatDateHuman(day) }}</span>
							</div>

							<div
								v-for="(activity, index) in dayActivities"
								:key="activity.id"
								class="group flex flex-col gap-1 pb-2 border-b border-b-slate-200"
							>
								<div class="grid grid-cols-[1fr_1fr_1fr] gap-2 items-center">
									<p>{{ activity.title }}</p>

									<p class="text-center">{{ activity.start }}</p>

									<span class="text-center">{{
										activity.jury?.length
											? activity.jury.length
											: 'Не назначены'
									}}</span>
								</div>
								<!-- 
								<div
									class="group-hover:flex hidden col-span-4 justify-center relative select-none"
								>
									<span
										class="bg-slate-400 z-0 left-0 self-center h-px w-full absolute"
									></span>
								</div> -->
							</div>
						</div>
					</div>
					<p v-else>Активности... отсутствуют?</p>
				</div>
			</div>

			<div
				v-else
				class="flex self-center flex-col items-center md:w-175 min-h-0 min-w-0 h-fit w-full"
			>
				<event-form-base
					ref="formRef"
					v-if="event"
					v-model="editableEvent"
					:cities="cities"
					:areas="areas"
				/>

				<button
					v-if="isEditMode"
					@click="handleSave"
					class="mt-2 bg-green-400 px-3 py-1 rounded w-full"
				>
					Сохранить
				</button>
			</div>
		</div>
	</div>
</template>

<style scoped lang="css"></style>
