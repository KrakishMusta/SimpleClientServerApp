<script setup lang="ts">
	import { onMounted } from 'vue';
	import { RouterLink, RouterView } from 'vue-router';
	import { useInitAuthMutation } from '@/features/auth/hooks/useInitAuthMutation';

	const { initAuth } = useInitAuthMutation();

	onMounted(async () => {
		await initAuth();
	});
</script>

<template>
	<div class="wrapper min-w-0 min-h-0 w-full h-full max-w-full">
		<!-- <p>{{ $route.fullPath }}</p> -->
		<div
			v-if="$route.fullPath === `/`"
			class="p-10 flex gap-10 flex-col min-w-0 min-h-0 w-full h-full"
		>
			<h1 class="text-4xl">Платформа для создания и участия в мероприятиях</h1>
			<div class="flex flex-col gap-4 p-6 bg-slate-200 w-fit rounded-lg shadow-2xl">
				<p>Нет учётной записи?</p>
				<router-link
					class="p-2 min-w-0 w-fit min-h-0 h-fit text-xl rounded-sm bg-slate-400"
					to="/auth/register"
					>Регистрация</router-link
				>
			</div>

			<div class="flex flex-col gap-4 p-6 bg-slate-200 w-fit rounded-lg shadow-2xl">
				<p>Есть учётная запись?</p>
				<router-link
					class="p-2 min-w-0 w-fit min-h-0 h-fit text-xl rounded-sm bg-slate-400"
					to="/auth/login"
					>Вход</router-link
				>
			</div>
		</div>

		<router-view></router-view>
	</div>
</template>

<style scoped lang="css">
	.wrapper {
		display: flex;
		place-items: flex-start;
		flex-wrap: wrap;
	}
</style>
