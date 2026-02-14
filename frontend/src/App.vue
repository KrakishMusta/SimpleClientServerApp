<script setup lang="ts">
	import { computed, onMounted, ref, useTemplateRef } from 'vue';
	import { RouterLink, RouterView, useRoute } from 'vue-router';
	import { useInitAuthMutation } from '@/features/auth/hooks/useInitAuthMutation';

	import AppHeader from './widgets/app-header/ui/AppHeader.vue';

	const { initAuth } = useInitAuthMutation();

	const isAppReady = ref(false);

	onMounted(async () => {
		console.log(`refresh onMounted`);
		await initAuth();
		isAppReady.value = true;
	});
</script>

<template>
	<div
		v-if="isAppReady"
		class="wrapper min-w-0 min-h-0 w-full h-full bg-linear-to-br from-slate-900 via-slate-800 to-slate-950 text-slate-100"
	>
		<!-- <p>{{ $route.fullPath }}</p> -->

		<AppHeader />
		<!-- <pre>{{ $route.name }}</pre> -->

		<router-view
			class="p-6 md:p-10 flex min-w-0 w-full box-border h-full min-h-0"
			v-slot="{ Component }"
		>
			<transition name="fade" mode="out-in">
				<component :is="Component" />
			</transition>
		</router-view>
	</div>
	<div v-else class="flex items-center justify-center w-full h-screen bg-slate-900 text-white">
		Загрузка...
	</div>
</template>

<style scoped lang="css">
	.wrapper {
		display: flex;
		flex-direction: column;
		place-items: flex-start;
		/* flex-wrap: wrap; */
	}
</style>
