<script setup lang="ts">
	import { IArea } from '@/features/dictionary/types/area.interface';
	import { ICity } from '@/features/dictionary/types/city.interface';
	import { computed, ref } from 'vue';
	import { IActivityRecord, IEvent } from '../types/event.types';
	import { useCreateEvent } from '../hooks/useCreateEventMutation';
	import { watch } from 'vue';
	import { addMinutes } from '@/shared/utils/addMinutes';
	import { formatDateForInput, parseDateFromInput } from '@/shared/utils/formatDate';

	const DAY_START = '09:00';
	const DAY_END = '22:30';
	const ACTIVITY_DURATION = 105;
	const { mutate, isPending, error } = useCreateEvent();
	interface CreateEventFormProps {
		cities: ICity[];
		areas: IArea[];
	}
	const props = defineProps<CreateEventFormProps>();

	const startDateRef = ref<string>(formatDateForInput(new Date()));
	const endDateRef = ref<string>(formatDateForInput(new Date()));
	const titleRef = ref<string | null>(null);
	const areaRef = ref<string | null>(null);
	const cityRef = ref<string | null>(null);

	const activities = ref<IActivityRecord[] | null>([]);

	// const activitiesCount = ref<number>(3);
	const maxDayIndex = ref<number>(0);

	// Инициализация массива пустыми объектами
	for (let i = 0; i < 3; i++) {
		activities.value.push({
			title: i.toString(),
			start: '',
			dayIndex: maxDayIndex.value,
			date: formatDateForInput(new Date()),
			jury: null,
		});
	}

	const activitiesByDay = computed(() => {
		const map = new Map<number, typeof activities.value>();

		for (const activity of activities.value) {
			// console.log(!map.has(activity.dayIndex));
			if (!map.has(activity.dayIndex)) {
				map.set(activity.dayIndex, []);
			}
			map.get(activity.dayIndex).push(activity);
		}

		return [...map.entries()];
	});

	function normalizeTime(e: Event, index: number, dayIndex: number) {
		let value = (e.target as HTMLInputElement).value;

		value = value < '09:00' ? '09:00' : value;
		value = value > '22:30' ? '22:30' : value;

		activities.value[index].start = value;

		updateActivitiesStart(dayIndex);
	}

	function updateActivitiesStart(dayIndex: number, startIndex: number = 1) {
		const dayActivities = activitiesByDay.value[dayIndex][1];
		for (let i = startIndex; i < dayActivities.length; i++) {
			const prev = dayActivities[i - 1];

			const currentActivityTimeLimit = addMinutes(prev.start, ACTIVITY_DURATION);

			if (currentActivityTimeLimit <= DAY_END && currentActivityTimeLimit >= DAY_START) {
				dayActivities[i].start = currentActivityTimeLimit;
			} else {
				dayActivities[i].start = '';
			}
		}
	}

	function addActivity(beforeActivityIndex: number, dayIndex: number, date: Date) {
		// console.log(activitiesByDay.value[dayIndex][1][beforeActivityIndex]);
		if (activitiesByDay.value[dayIndex][1][beforeActivityIndex].start !== ``) {
			const currentActivityTimeLimit = addMinutes(
				activitiesByDay.value[dayIndex][1][beforeActivityIndex].start,
				105,
			);
			console.log(currentActivityTimeLimit);
			if (currentActivityTimeLimit <= DAY_END && currentActivityTimeLimit >= DAY_START) {
				const insertIndex = beforeActivityIndex + 1;
				activities.value.splice(insertIndex, 0, {
					title: '777',
					start: currentActivityTimeLimit,
					dayIndex,
					date: formatDateForInput(date),
					jury: null,
				});
				updateActivitiesStart(dayIndex, insertIndex + 1);
			}
		} else {
			activities.value.push({
				title: '',
				start: '',
				dayIndex: dayIndex,
				date: formatDateForInput(date),
				jury: null,
			});
		}
	}

	function removeActivity(index: number) {
		activities.value.splice(index, 1);
	}

	function addDay() {
		maxDayIndex.value++;

		const date = new Date(startDateRef.value);
		// console.log(date);
		date.setDate(date.getDate() + maxDayIndex.value);

		activities.value.push({
			title: '',
			start: '',
			dayIndex: maxDayIndex.value,
			date: formatDateForInput(date),
			jury: null,
		});
	}

	function removeDay(dayIndex: number) {
		if (!activities.value) return;

		// 1. Удаляем активности выбранного дня
		activities.value = activities.value.filter((activity) => activity.dayIndex !== dayIndex);

		// 2. Сдвигаем dayIndex у следующих дней
		for (const activity of activities.value) {
			if (activity.dayIndex > dayIndex) {
				activity.dayIndex--;
				const date = new Date(startDateRef.value);
				// console.log(date);
				date.setDate(date.getDate() + activity.dayIndex);
				activity.date = formatDateForInput(date);
			}
		}

		// 3. Обновляем максимальный индекс дня
		maxDayIndex.value--;

		console.log(activities.value);
	}

	function handleCreateEvent() {
		if (!startDateRef.value) return;

		// const startDate = parseDateFromInput(startDateRef.value);
		// const endDate = endDateRef.value ? parseDateFromInput(endDateRef.value) : startDate;

		console.log(activitiesByDay.value.length);

		const mappedActivities = activities.value.filter((activity) => activity.start !== '');

		console.log(mappedActivities);

		let payload: IEvent = {
			title: titleRef.value,
			startDate: startDateRef.value,
			endDate: endDateRef.value,
			durationDays: activitiesByDay.value.length,
			durationMins: 0,
			cityId: cityRef.value,
			areaId: areaRef.value,
			activities: mappedActivities,
		};

		mutate(payload);
	}

	watch(
		() => props.areas,
		(areas) => {
			if (areas.length && !areaRef.value) {
				areaRef.value = areas[0].id;
			}
		},
		{ immediate: true },
	);

	watch(
		() => props.cities,
		(cities) => {
			if (cities.length && !cityRef.value) {
				cityRef.value = cities[0].id;
			}
		},
		{ immediate: true },
	);

	watch(
		() => [startDateRef.value, maxDayIndex.value] as [string, number],
		([startDate, maxDay]) => {
			if (!startDate) return;

			const date = parseDateFromInput(startDate);
			date.setDate(date.getDate() + maxDay);

			endDateRef.value = formatDateForInput(date);

			// console.log(`watch`, endDateRef.value, date);
		},
		{ immediate: true },
	);

	// ??
	// watch(activitiesWithDays, (list) => {
	// 	if (!list.length || !startDateRef.value) return;

	// 	const last = list[list.length - 1].computedData.date;
	// 	endDateRef.value = formatDateForInput(last);
	// });
	// ??
	// watch(activitiesCount, updateActivitiesStart);
</script>

<template>
	<div class="flex flex-col md:min-w-175 min-w-0 h-full min-h-0 gap-4">
		<h2 class="font-semibold text-2xl">Создание мероприятия</h2>
		<div class="flex flex-col gap-3">
			<div class="flex gap-2 justify-between w-full">
				<label for="startDate" class="p-1 pl-0">Начало</label>
				<input
					v-model="startDateRef"
					id="startDate"
					name="startDate"
					class="border border-solid p-1 text-slate-100"
					type="date"
					style="color-scheme: dark"
				/>
			</div>
			<div class="flex gap-2 justify-between w-full">
				<label for="endDate" class="p-1 pl-0">Окончание</label>
				<input
					v-model="endDateRef"
					readonly
					id="endDate"
					name="endDate"
					class="border border-solid p-1"
					type="date"
				/>
			</div>
			<div class="flex gap-2 justify-between w-full">
				<label for="name" class="p-1 pl-0">Название</label>
				<input
					v-model="titleRef"
					:placeholder="`Курс по оформлению и формированию ТЗ для чайников`"
					id="name"
					name="name"
					class="border border-solid p-1"
					type="text"
				/>
			</div>
			<div class="flex gap-2 justify-between w-full">
				<label for="area" class="p-1 pl-0">Направление</label>
				<select name="area" id="area" v-model="areaRef">
					<option
						class="text-end"
						v-for="area in areas"
						:key="area.name"
						:value="area.id"
					>
						{{ area.name }}
					</option>
				</select>
			</div>
			<div class="flex gap-2 justify-between w-full">
				<label for="city" class="p-1 pl-0">Город</label>
				<select name="city" id="city" v-model="cityRef">
					<option class="text-end" v-for="city in cities" :key="city.id" :value="city.id">
						{{ city.name }}
					</option>
				</select>
			</div>
		</div>
		<span class="w-full bg-slate-400 h-px"></span>
		<div class="flex flex-col gap-3 min-h-0 max-h-full">
			<h2 class="font-semibold text-xl">Активности</h2>
			<!-- {{ activitiesByDay }}
			{{ activitiesWithDays }} -->
			<div class="grid grid-cols-[1fr_1fr_34px] gap-2 font-semibold pr-1.5">
				<div class="flex items-center">Наименование</div>
				<div class="flex justify-center items-center">Начало</div>
				<!-- <div class="flex justify-center items-center">Жюри</div> -->
				<div class="size-8.5"></div>
			</div>

			<!-- <pre class="text-[8px]">{{ activities }}</pre> -->
			<!-- Список активностей -->

			<div class="flex flex-col gap-2 max-h-full overflow-y-auto scrollbar-custom">
				<div
					v-for="[dayIndex, dayActivities] in activitiesByDay"
					:key="dayIndex"
					class="flex flex-col gap-2"
				>
					<!-- Заголовок дня -->
					<div
						class="col-span-4 flex gap-2 box-border border border-slate-100 justify-center font-semibold p-1 rounded select-none"
					>
						<span class="text-slate-100"
							>День {{ dayIndex + 1 }} — {{ dayActivities[0].date }}</span
						>
						<button
							@click="removeDay(dayIndex)"
							class="bg-red-400 hover:bg-red-600 cursor-pointer h-full aspect-square"
							type="button"
						>
							-
						</button>
					</div>

					<!-- Активности дня -->
					<div
						v-for="(activity, index) in dayActivities"
						:key="index"
						class="group flex flex-col gap-1"
					>
						<div class="grid grid-cols-[1fr_1fr_34px] gap-2 items-center">
							<input v-model="activity.title" type="text" class="border p-1 w-full" />

							<input
								style="color-scheme: dark"
								type="time"
								v-model="activity.start"
								class="border p-1 w-full text-slate-100"
								min="09:00"
								max="22:30"
								@change="(e) => normalizeTime(e, index, dayIndex)"
								:readonly="
									index !== 0 &&
									(addMinutes(dayActivities[index - 1].start, 105) < '23:00' ||
										addMinutes(dayActivities[index - 1].start, 105) > '9:00' ||
										dayActivities[index].start === ``)
								"
							/>

							<!-- <span class="text-center"></span> -->

							<button
								@click="removeActivity(index)"
								class="select-none bg-red-400 hover:bg-red-600 w-8.5 aspect-square"
							>
								-
							</button>
						</div>

						<div
							class="group-hover:flex hidden col-span-4 justify-center relative select-none"
						>
							<span
								@click="
									addActivity(
										index,
										activity.dayIndex,
										parseDateFromInput(activity.date),
									)
								"
								class="bg-white z-10 px-1 select-none hover:bg-slate-200 cursor-pointer"
								>+ Добавить активность</span
							>
							<span
								class="bg-slate-400 z-0 left-0 self-center h-px w-full absolute"
							></span>
						</div>
					</div>
				</div>
				<!-- Добавление дня -->
				<div
					@click="addDay"
					class="select-none col-span-4 text-center font-semibold bg-slate-100 p-1 hover:bg-slate-400 cursor-pointer"
				>
					+ Добавить день
				</div>
			</div>

			<!-- Добавление новой активности -->
			<!-- <button @click="addActivity" class="p-2 bg-slate-200 hover:bg-slate-400 w-max rounded">
				+ Добавить запись
			</button> -->
		</div>
		<div>
			<button
				v-on:click="handleCreateEvent"
				class="select-none p-2 rounded-md text-base font-bold bg-slate-400 hover:bg-transparent box-border hover:border hover:border-slate-100 cursor-pointer"
				type="button"
			>
				Создать
			</button>
		</div>
	</div>
</template>

<style lang="css"></style>
