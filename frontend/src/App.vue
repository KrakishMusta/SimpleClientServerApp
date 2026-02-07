<script setup lang="ts">
	import { computed, onMounted, shallowRef, ref } from 'vue';
	import { RouterLink, RouterView, useRoute } from 'vue-router';
	import { useInitAuthMutation } from '@/features/auth/hooks/useInitAuthMutation';
	import { useUserInfo } from './entities/user/model/useUserInfo';
	import { onClickOutside } from '@vueuse/core';
	const route = useRoute();
	const userInfo = useUserInfo();
	const { initAuth } = useInitAuthMutation();

	const currentPage = computed(() => route.name);

	const isOpenDropdownRef = shallowRef(false);
	const dropdownRef = ref<HTMLElement | null>(null);

	onClickOutside(dropdownRef, () => {
		isOpenDropdownRef.value = false;
	});

	onMounted(async () => {
		console.log(`refresh onMounted`);
		await initAuth();
	});
</script>

<template>
	<div class="wrapper min-w-0 min-h-0 w-full h-full max-w-full">
		<!-- <p>{{ $route.fullPath }}</p> -->

		<div
			class="flex max-[500px]:h-20 h-10 w-full items-center gap-4 px-10 py-2 box-border bg-slate-800 text-slate-100"
		>
			{{ userInfo.isLoggedIn }}
			<RouterLink
				to="/"
				class="px-3 py-1 rounded"
				:class="{
					'bg-slate-600 underline decoration-slate-100 cursor-default':
						currentPage === 'domain',
				}"
			>
				Главная
			</RouterLink>

			<RouterLink
				to="/events/user-events"
				class="px-3 py-1 rounded"
				:class="{
					'bg-slate-600 underline decoration-slate-100 cursor-default':
						currentPage === 'user-events',
				}"
			>
				Мои мероприятия
			</RouterLink>

			<RouterLink
				to="/events"
				class="px-3 py-1 rounded"
				:class="{
					'bg-slate-600 underline decoration-slate-100 cursor-default':
						currentPage === 'events',
				}"
			>
				Мероприятия
			</RouterLink>

			<div ref="dropdownRef" class="ml-auto relative">
				<div
					v-if="userInfo.isLoggedIn.value"
					@click.stop="isOpenDropdownRef = !isOpenDropdownRef"
					class="rounded-full cursor-pointer hover:bg-slate-400 bg-slate-100 h-8 flex justify-center items-center p-2"
				>
					<span class="text-slate-800">Профиль.</span>
				</div>
				<div v-else class="max-[500px]:text-sm text-base">
					Часть функций недоступна,
					<router-link to="/auth/login"> авторизуйтесь! </router-link>
				</div>
				<div v-if="isOpenDropdownRef" class="absolute bg-slate-100 right-0">
					<nav class="p-2 text-slate-800 text-nowrap">Настройки профиля</nav>
				</div>
			</div>
		</div>
		<div
			v-if="$route.fullPath === `/`"
			class="p-10 flex gap-10 flex-col min-w-0 min-h-0 w-full h-full"
		>
			<h1 class="text-4xl">Платформа для создания и участия в мероприятиях</h1>
			<div class="flex gap-10 min-w-0 min-h-0 w-full" v-if="userInfo.isLoggedIn.value">
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
		</div>

		<router-view
			v-else
			class="p-10 flex min-w-0 w-full box-border h-full min-h-0"
		></router-view>
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
