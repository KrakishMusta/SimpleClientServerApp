<script setup lang="ts">
	import { ref, computed, watch } from 'vue';
	import { IActivityRecord, IEvent } from '../types/event.types';
	import { addMinutes } from '@/shared/utils/addMinutes';
	import {
		formatDateForInput,
		formatDateHuman,
		parseDateFromInput,
	} from '@/shared/utils/formatDate';
	import { ICity } from '@/features/dictionary/types/city.interface';
	import { IArea } from '@/features/dictionary/types/area.interface';

	const DAY_START = '09:00';
	const DAY_END = '22:30';
	const ACTIVITY_DURATION = 105;

	interface FormProps {
		modelValue?: IEvent; // передаем объект события
		cities: ICity[];
		areas: IArea[];
	}

	function createEmptyEvent(): IEvent {
		return {
			title: '',
			cityId: null,
			areaId: null,
			startDate: '',
			endDate: '',
			activities: [],
			durationDays: 0,
			durationMins: 0,
		};
	}

	function normalizeTime(e: Event, activity: IActivityRecord, dayIndex: number) {
		let value = (e.target as HTMLInputElement).value;

		value = value < DAY_START ? DAY_START : value;
		value = value > DAY_END ? DAY_END : value;

		activity.start = value;

		updateActivitiesStart(dayIndex);
	}

	const props = defineProps<FormProps>();
	const emit = defineEmits<{
		(e: 'update:modelValue', value: IEvent): void;
	}>();

	// локальная копия события
	const localEvent = ref<IEvent>(
		JSON.parse(JSON.stringify(props.modelValue)) ?? createEmptyEvent(),
	);

	const startDateRef = ref(
		localEvent.value.startDate ? formatDateForInput(new Date(localEvent.value.startDate)) : '',
	);
	const endDateRef = ref(
		localEvent.value.endDate ? formatDateForInput(new Date(localEvent.value.endDate)) : '',
	);

	// Доступ к городам/областям
	const cities = computed(() => props.cities);
	const areas = computed(() => props.areas);

	function normalizeActivities(
		activitiesByDay: Record<string, IActivityRecord[]>,
	): IActivityRecord[] {
		return Object.values(activitiesByDay ?? {}).flat();
	}

	// --- Активности ---
	const activities = ref<IActivityRecord[]>(localEvent.value.activities || []);
	const maxDayIndex = ref(Math.max(...activities.value.map((a) => a.dayIndex), 0));

	// группировка по дням
	const activitiesByDay = computed(() => {
		const map = new Map<number, IActivityRecord[]>();

		for (const activity of activities.value) {
			if (!map.has(activity.dayIndex)) {
				map.set(activity.dayIndex, []);
			}
			map.get(activity.dayIndex)!.push(activity);
		}

		// сортировка внутри каждого дня
		for (const [, list] of map) {
			list.sort((a, b) => {
				if (!a.start) return 1;
				if (!b.start) return -1;
				return a.start.localeCompare(b.start);
			});
		}

		return [...map.entries()].sort((a, b) => a[0] - b[0]);
	});

	// Обновляем start для последующих активностей
	function updateActivitiesStart(dayIndex: number, startIndex = 1) {
		const dayActivities = activitiesByDay.value[dayIndex][1];
		for (let i = startIndex; i < dayActivities.length; i++) {
			const prev = dayActivities[i - 1];
			const nextTime = addMinutes(prev.start, ACTIVITY_DURATION);
			dayActivities[i].start = nextTime <= DAY_END && nextTime >= DAY_START ? nextTime : '';
		}
	}

	function addActivity(afterActivity: IActivityRecord, date: Date) {
		const start = afterActivity.start ? addMinutes(afterActivity.start, ACTIVITY_DURATION) : '';

		if (start && (start < DAY_START || start > DAY_END)) return;

		activities.value.push({
			title: Math.random().toString(),
			start,
			dayIndex: afterActivity.dayIndex,
			date: formatDateForInput(date),
			jury: null,
		});

		updateActivitiesStart(afterActivity.dayIndex);
	}

	function removeActivity(activityToRemove: IActivityRecord) {
		activities.value = activities.value.filter((a) => a !== activityToRemove);
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

	function syncParent() {
		console.log(`SYNC`, localEvent.value);
		localEvent.value.endDate = endDateRef.value;
		emit('update:modelValue', {
			...localEvent.value,
			activities: activities.value,
		});
	}

	// --- Синхронизация модели снаружи ---
	// watch(
	// 	[
	// 		activities,
	// 		() => localEvent.value.title,
	// 		() => localEvent.value.cityId,
	// 		() => localEvent.value.areaId,
	// 		() => localEvent.value.startDate,
	// 		() => localEvent.value.endDate,
	// 	],
	// 	() => {
	// 		console.log(`SYNC`, localEvent.value);
	// 		emit('update:modelValue', {
	// 			...localEvent.value,
	// 			activities: activities.value,
	// 		});
	// 	},
	// 	{ deep: true },
	// );

	watch(
		() => localEvent.value.startDate,
		(newVal) => {
			startDateRef.value = newVal ? formatDateForInput(new Date(newVal)) : '';
		},
		{ immediate: true },
	);

	watch(
		() => localEvent.value.endDate,
		(newVal) => {
			endDateRef.value = newVal ? formatDateForInput(new Date(newVal)) : '';
		},
		{ immediate: true },
	);

	// Синхронизируем при изменении внешнего modelValue
	watch(
		() => props.modelValue,
		(newVal) => {
			if (newVal) {
				// Создаём независимую копию для редактирования
				localEvent.value = JSON.parse(JSON.stringify(newVal));
			} else {
				// Если пришло null/undefined, создаём пустое событие
				localEvent.value = createEmptyEvent();
			}
		},
		{ immediate: true }, // сразу инициализирует при mount
	);

	watch(
		() => [startDateRef.value, maxDayIndex.value] as const,
		([startDate, maxDay]) => {
			if (!startDate) return;

			const baseDate = parseDateFromInput(startDate);

			// 1️⃣ activity.date
			for (const activity of activities.value) {
				const d = new Date(baseDate);
				d.setDate(d.getDate() + activity.dayIndex);
				activity.date = formatDateForInput(d);
			}

			// 2️⃣ endDate
			const end = new Date(baseDate);
			end.setDate(end.getDate() + maxDay);
			endDateRef.value = formatDateForInput(end);
		},
		{ immediate: true },
	);

	defineExpose({
		syncParent,
	});
</script>

<template>
	<!-- <pre>
		{{ localEvent }}
	</pre> -->
	<div class="flex flex-col min-w-0 w-full h-fit min-h-0 gap-4">
		<div class="flex flex-col gap-3">
			<div class="flex gap-2 justify-between items-center w-full">
				<label class="p-1 pl-0">Название</label>
				<input
					type="text"
					v-model="localEvent.title"
					class="border border-solid p-1 text-slate-100 w-fit"
					id="name"
					name="name"
					:placeholder="`Курс по ТЗ для чайников`"
				/>
			</div>
			<div class="flex gap-2 items-center justify-between w-full">
				<label class="p-1 pl-0">Направление</label>
				<select name="area" id="area" v-model="localEvent.areaId">
					<option
						class="text-end text-slate-800"
						v-for="area in areas"
						:key="area.name"
						:value="area.id"
					>
						{{ area.name }}
					</option>
				</select>
			</div>
			<div class="flex gap-2 items-center justify-between w-full">
				<label class="p-1 pl-0">Город</label>
				<select name="city" id="city" v-model="localEvent.cityId">
					<option
						class="text-end text-slate-800"
						v-for="city in cities"
						:key="city.id"
						:value="city.id"
					>
						{{ city.name }}
					</option>
				</select>
			</div>
			<div class="flex gap-2 items-center justify-between w-full">
				<label class="p-1 pl-0">Начало</label>
				<input
					class="border border-solid p-1"
					type="date"
					v-model="startDateRef"
					style="color-scheme: dark"
					@change="localEvent.startDate = startDateRef"
				/>
			</div>
			<div class="flex gap-2 items-center justify-between w-full">
				<label class="p-1 pl-0">Окончание</label>
				<input class="border border-solid p-1" type="date" v-model="endDateRef" readonly />
			</div>
		</div>

		<div class="flex flex-col gap-3 min-h-0 max-h-full">
			<h2 class="font-semibold text-xl">Активности</h2>
			<!-- {{ activitiesByDay }}
			{{ activitiesWithDays }} -->
			<div class="grid grid-cols-[1fr_1fr_1fr_34px] gap-2 font-semibold pr-1.5">
				<div class="flex items-center">Наименование</div>
				<div class="flex justify-center items-center">Начало</div>
				<div class="flex justify-center items-center">Жюри</div>
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
						class="flex gap-2 box-border border border-slate-100 justify-center items-center font-semibold p-1 rounded select-none"
					>
						<span class="text-slate-100"
							>День {{ dayIndex + 1 }} —
							{{ formatDateHuman(dayActivities[0].date) }}
						</span>
						<button
							@click="removeDay(dayIndex)"
							class="flex items-center justify-center select-none bg-red-400 hover:bg-red-600 h-full aspect-square"
							type="button"
						>
							<span class="inline-block h-6 leading-6">-</span>
						</button>
					</div>

					<!-- Активности дня -->
					<div
						v-for="(activity, index) in dayActivities"
						:key="index"
						class="group flex flex-col gap-1"
					>
						<div class="grid grid-cols-[1fr_1fr_1fr_34px] gap-2 items-center">
							<input v-model="activity.title" type="text" class="border p-1 w-full" />

							<input
								style="color-scheme: dark"
								type="time"
								v-model="activity.start"
								class="border border-solid p-1 text-slate-100"
								min="09:00"
								max="22:30"
								@change="(e) => normalizeTime(e, activity, dayIndex)"
								:readonly="
									index !== 0 &&
									(addMinutes(dayActivities[index - 1].start, 105) < '23:00' ||
										addMinutes(dayActivities[index - 1].start, 105) > '9:00' ||
										dayActivities[index].start === ``)
								"
							/>

							<!-- <span class="text-center"></span> -->

							<button
								@click="removeActivity(activity)"
								class="select-none bg-red-400 hover:bg-red-600 w-8.5 aspect-square"
							>
								-
							</button>
						</div>

						<div
							class="group-hover:flex hidden col-span-4 justify-center relative select-none"
						>
							<span
								@click="addActivity(activity, parseDateFromInput(activity.date))"
								class="border hover:bg-slate-700 border-slate-100 bg-slate-800 z-10 px-1 select-none cursor-pointer"
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
					class="select-none col-span-4 text-center font-semibold border border-slate-100 p-1 cursor-pointer"
				>
					+ Добавить день
				</div>
			</div>

			<!-- Добавление новой активности -->
			<!-- <button @click="addActivity" class="p-2 bg-slate-200 hover:bg-slate-400 w-max rounded">
				+ Добавить запись
			</button> -->
		</div>
	</div>
</template>

<style scoped>
	button {
		cursor: pointer;
	}
</style>
