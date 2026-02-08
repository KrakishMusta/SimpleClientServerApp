<script setup lang="ts">
	import { ref } from 'vue';
	import EventFormBase from './EventFormBase.vue';
	import { useCreateEvent } from '../hooks/useCreateEventMutation';
	import { IEvent } from '../types/event.types';

	const { mutate } = useCreateEvent();

	const cities = ref([]);
	const areas = ref([]);

	const draftEvent = ref<IEvent>({
		title: '',
		cityId: '',
		areaId: '',
		startDate: new Date().toISOString().split('T')[0],
		endDate: new Date().toISOString().split('T')[0],
		durationDays: 0,
		durationMins: 0,
		activities: [],
	});

	function handleCreate() {
		mutate(draftEvent.value);
	}
</script>

<template>
	<EventFormBase v-model="draftEvent" :cities="cities" :areas="areas" />
	<button @click="handleCreate" class="mt-2 bg-slate-400 px-3 py-1">Создать</button>
</template>
