<script setup lang="ts">
	import { IArea } from '@/features/dictionary/types/area.interface';
	import { ICity } from '@/features/dictionary/types/city.interface';
	import { ref } from 'vue';
	import { IActivityRecord, IEvent } from '../types/event.types';
	import { useCreateEvent } from '../hooks/useCreateEventMutation';
	import { watch } from 'vue';
	import { addMinutes } from '@/shared/utils/addMinutes';
	import { formatDateForInput, parseDateFromInput } from '@/shared/utils/formatDate';

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

	const activitiesCount = ref<number>(1);

	// Инициализация массива пустыми объектами
	for (let i = 0; i < activitiesCount.value; i++) {
		activities.value.push({ title: '', start: '', jury: null });
	}

	function normalizeTime(e: Event, index: number) {
		let value = (e.target as HTMLInputElement).value;

		value = value < '09:00' ? '09:00' : value;
		value = value >= '22:30' ? '22:30' : value;

		activities.value[index].start = value;

		updateActivitiesStart();
	}

	function updateActivitiesStart() {
		for (let i = 1; i !== activitiesCount.value; i++) {
			const currentActivityTimeLimit = addMinutes(activities.value[i - 1].start, 105);
			if (currentActivityTimeLimit <= '22:30' && currentActivityTimeLimit >= `09:00`) {
				activities.value[i].start = currentActivityTimeLimit;
			} else {
				if (activities.value[i].start === '') {
					break;
				}
			}
		}
	}

	function addActivity() {
		activities.value.push({ title: '', start: '', jury: null });
		activitiesCount.value++;
	}

	function removeActivity(index: number) {
		activities.value.splice(index, 1);
		console.log(activities.value);
		activitiesCount.value--;
	}

	function handleCreateEvent() {
		if (!startDateRef.value) return;

		const startDate = parseDateFromInput(startDateRef.value);
		const endDate = endDateRef.value ? parseDateFromInput(endDateRef.value) : startDate;

		// console.log(activitiesByDay.value.length);

		let payload: IEvent = {
			title: titleRef.value,
			startDate: startDate,
			endDate: endDate,
			// durationDays: activitiesByDay.value.length,
			durationMins: 0,
			cityId: cityRef.value,
			areaId: areaRef.value,
			activities: null,
		};

		// mutate(payload);
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

	watch(activitiesCount, updateActivitiesStart);
</script>

<template>
	<div class="flex flex-col min-w-0 h-full max-h-full gap-4">
		<h2 class="font-semibold text-2xl">Создание мероприятия</h2>
		<div class="flex flex-col gap-3">
			<div class="flex gap-2 justify-between w-full">
				<label for="startDate" class="p-1 pl-0">Начало</label>
				<input
					v-model="startDateRef"
					id="startDate"
					name="startDate"
					class="border border-solid p-1"
					type="date"
				/>
			</div>
			<div class="flex gap-2 justify-between w-full">
				<label for="endDate" class="p-1 pl-0">Окончание</label>
				<input
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
					<option
						class="text-end"
						v-for="city in cities.slice(0, 10)"
						:key="city.id"
						:value="city.id"
					>
						{{ city.name }}
					</option>
				</select>
			</div>
		</div>
		<span class="w-full bg-slate-400 h-px"></span>
		<div class="flex flex-col gap-3 min-h-0 max-h-full">
			<h2 class="font-semibold text-xl">Активности {{ activitiesCount }}</h2>

			<div class="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 font-semibold">
				<div>Наименование</div>
				<div class="text-center">Время</div>
				<div class="text-center">Жюри</div>
				<div class="size-8.5"></div>
			</div>

			<!-- <pre class="text-[8px]">{{ activities }}</pre> -->
			<!-- Список активностей -->
			<div class="flex flex-col gap-2 max-h-full overflow-y-auto scrollbar-custom">
				<div
					class="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-center"
					v-for="(item, index) in activitiesCount"
					:key="index"
				>
					<!-- логика инкремента дней от startDateRef -->
					<!-- <span class="col-span-4 text-center">{{ startDateRef + 1 }}</span> -->
					<span class="col-span-4 text-center">{{ startDateRef }}</span>
					<input
						v-model="activities[index].title"
						type="text"
						class="border p-1 w-full"
					/>
					<!-- v-model="activities[index].start" -->
					<!-- :readonly="
							index !== 0 &&
							addMinutes(activities[index - 1].start, 105) <= '22:30' &&
							addMinutes(activities[index - 1].start, 105) >= '09:00'
						" -->
					<input
						type="time"
						v-model="activities[index].start"
						min="09:00"
						max="22:30"
						@change="(e) => normalizeTime(e, index)"
						class="border p-1 w-full"
					/>
					<span class="text-center underline underline-offset-4"
						><span v-if="index !== 0"
							>{{ index }} {{ addMinutes(activities[index - 1].start, 105) }}
							{{ addMinutes(activities[index - 1].start, 105) > '23:00' }}</span
						><span v-else></span
					></span>
					<!-- @click="activitiesCount--" -->
					<button
						@click="removeActivity(index)"
						class="bg-red-200 flex justify-center items-center hover:bg-red-400 cursor-pointer aspect-square h-full"
					>
						-
					</button>
				</div>
			</div>

			<!-- Добавление новой активности -->
			<button @click="addActivity" class="p-2 bg-slate-200 hover:bg-slate-400 w-max rounded">
				+ Добавить запись
			</button>
		</div>
		<div>
			<button
				v-on:click="handleCreateEvent"
				class="p-2 rounded-md text-base font-bold bg-slate-200"
				type="button"
			>
				Создать
			</button>
		</div>
	</div>
</template>

<style lang="css"></style>
