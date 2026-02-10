<script setup lang="ts">
	import { useGetAreaDictionary } from '@/features/dictionary/hooks/useGetAreaDictionary';
	import { useGetCityDictionary } from '@/features/dictionary/hooks/useGetCityDictionary';
	import CreateEventForm from '@/features/event/ui/CreateEventForm.vue';
	import { computed } from 'vue';

	const { data: cityDictionary } = useGetCityDictionary();
	const { data: areaDictionary } = useGetAreaDictionary();

	const cities = computed(() => cityDictionary.value ?? []);
	const areas = computed(() => areaDictionary.value ?? []);
</script>

<template>
	<div class="items-center gap-4">
		<router-link
			class="select-none self-start col-span-4 text-center font-semibold bg-slate-400 p-2 w-fit text-xl rounded-sm hover:bg-slate-400/10 cursor-pointer"
			to="/events"
			>К мероприятиям</router-link
		>
		<!-- <pre class="break-wordsmin-w-0 max-w-full overflow-x-auto">{{ cities.slice(10) }}</pre> -->
		<CreateEventForm :cities="cities" :areas="areas" />
	</div>
</template>

<style scoped lang="css"></style>
