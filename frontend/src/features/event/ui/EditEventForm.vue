<script setup lang="ts">
	import { ref, watch } from 'vue';
	import EventFormBase from './EventFormBase.vue';
	import { IEvent } from '../types/event.types';
	import { useUpdateEventMutation } from '../hooks/useUpdateEventMutation';

	const { mutate } = useUpdateEventMutation();

	const props = defineProps<{ event: IEvent }>();
	const editableEvent = ref<IEvent>(structuredClone(props.event));

	watch(
		() => props.event,
		(newEvent) => {
			editableEvent.value = structuredClone(newEvent);
		},
	);

	function handleSave() {
		mutate(props.event.id, editableEvent.value);
	}
</script>

<template>
	<EventFormBase v-model="editableEvent" :cities="[]" :areas="[]" />
	<div class="mt-2 flex gap-2">
		<button @click="handleSave" class="bg-green-400 px-3 py-1">Сохранить</button>
	</div>
</template>
