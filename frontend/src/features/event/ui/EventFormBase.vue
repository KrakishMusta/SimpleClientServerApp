<script setup lang="ts">
	import { ref, computed, watch } from 'vue';
	import { IActivityRecord, IEvent } from '../types/event.types';
	import { addMinutes } from '@/shared/utils/addMinutes';
	import { formatDateForInput, parseDateFromInput } from '@/shared/utils/formatDate';
	import { ICity } from '@/features/dictionary/types/city.interface';
	import { IArea } from '@/features/dictionary/types/area.interface';

	const DAY_START = '09:00';
	const DAY_END = '22:30';
	const ACTIVITY_DURATION = 105;

	interface FormProps {
		modelValue: IEvent; // передаем объект события
		cities: ICity[];
		areas: IArea[];
		readonly?: boolean;
	}

	const props = defineProps<FormProps>();
	const emit = defineEmits<{
		(e: 'update:modelValue', value: IEvent): void;
	}>();

	// локальная копия события
	const localEvent = ref<IEvent>(structuredClone(props.modelValue));

	// Синхронизируем при изменении внешнего modelValue
	watch(
		() => props.modelValue,
		(newVal) => {
			localEvent.value = structuredClone(newVal);
		},
	);

	// Доступ к городам/областям
	const cities = computed(() => props.cities);
	const areas = computed(() => props.areas);

	// --- Активности ---
	const activities = ref<IActivityRecord[]>(localEvent.value.activities || []);
	const maxDayIndex = ref(Math.max(...activities.value.map((a) => a.dayIndex), 0));

	// группировка по дням
	const activitiesByDay = computed(() => {
		const map = new Map<number, IActivityRecord[]>();
		for (const activity of activities.value) {
			if (!map.has(activity.dayIndex)) map.set(activity.dayIndex, []);
			map.get(activity.dayIndex)!.push(activity);
		}
		return [...map.entries()];
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

	// Добавление активности
	function addActivity(beforeIndex: number, dayIndex: number, date: string) {
		const dayActivities = activitiesByDay.value[dayIndex][1];
		const prevStart = dayActivities[beforeIndex].start || DAY_START;
		const nextTime = addMinutes(prevStart, ACTIVITY_DURATION);
		activities.value.splice(beforeIndex + 1, 0, {
			title: '',
			start: nextTime,
			dayIndex,
			date,
			jury: null,
		});
		updateActivitiesStart(dayIndex, beforeIndex + 2);
	}

	// Удаление активности
	function removeActivity(index: number) {
		activities.value.splice(index, 1);
	}

	// Добавление/удаление дня
	function addDay() {
		maxDayIndex.value++;
		const date = new Date(localEvent.value.startDate);
		date.setDate(date.getDate() + maxDayIndex.value);
		activities.value.push({
			title: '',
			start: DAY_START,
			dayIndex: maxDayIndex.value,
			date: formatDateForInput(date),
			jury: null,
		});
	}

	function removeDay(dayIndex: number) {
		activities.value = activities.value.filter((a) => a.dayIndex !== dayIndex);
		for (const a of activities.value) {
			if (a.dayIndex > dayIndex) {
				a.dayIndex--;
			}
		}
		maxDayIndex.value--;
	}

	// --- Синхронизация модели снаружи ---
	watch(
		[
			activities,
			() => localEvent.value.title,
			() => localEvent.value.cityId,
			() => localEvent.value.areaId,
			() => localEvent.value.startDate,
			() => localEvent.value.endDate,
		],
		() => {
			emit('update:modelValue', {
				...localEvent.value,
				activities: activities.value,
			});
		},
		{ deep: true },
	);
</script>

<template>
	<div class="flex flex-col gap-4">
		<div class="flex flex-col gap-2">
			<label>Название</label>
			<input
				type="text"
				v-model="localEvent.title"
				:readonly="props.readonly"
				class="border p-1 w-full"
			/>

			<label>Направление</label>
			<select v-model="localEvent.areaId" :disabled="props.readonly">
				<option v-for="area in areas" :key="area.id" :value="area.id">
					{{ area.name }}
				</option>
			</select>

			<label>Город</label>
			<select v-model="localEvent.cityId" :disabled="props.readonly">
				<option v-for="city in cities" :key="city.id" :value="city.id">
					{{ city.name }}
				</option>
			</select>

			<label>Начало</label>
			<input type="date" v-model="localEvent.startDate" :readonly="props.readonly" />

			<label>Окончание</label>
			<input type="date" v-model="localEvent.endDate" readonly />
		</div>

		<div class="flex flex-col gap-2">
			<h3>Активности</h3>
			<div v-for="[dayIndex, dayActivities] in activitiesByDay" :key="dayIndex">
				<div class="flex justify-between items-center border p-1 rounded">
					<span>День {{ dayIndex + 1 }} — {{ dayActivities[0].date }}</span>
					<button v-if="!props.readonly" @click="removeDay(dayIndex)">-</button>
				</div>

				<div
					v-for="(activity, index) in dayActivities"
					:key="index"
					class="flex gap-2 items-center mt-1"
				>
					<input
						v-model="activity.title"
						type="text"
						:readonly="props.readonly"
						class="border p-1 flex-1"
					/>
					<input
						v-model="activity.start"
						type="time"
						:readonly="props.readonly"
						class="border p-1 w-24"
						min="09:00"
						max="22:30"
					/>
					<button
						v-if="!props.readonly"
						@click="removeActivity(index)"
						class="bg-red-400 px-2"
					>
						-
					</button>
				</div>

				<button
					v-if="!props.readonly"
					@click="addActivity(dayActivities.length - 1, dayIndex, dayActivities[0].date)"
					class="mt-1 bg-slate-200 px-2"
				>
					+ Добавить активность
				</button>
			</div>

			<button v-if="!props.readonly" @click="addDay" class="mt-2 bg-slate-200 px-2">
				+ Добавить день
			</button>
		</div>
	</div>
</template>

<style scoped>
	button {
		cursor: pointer;
	}
</style>
