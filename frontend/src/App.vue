<script setup lang="ts">
	import { computed, onMounted, ref, useTemplateRef } from 'vue';
	import { RouterLink, RouterView, useRoute } from 'vue-router';
	import { useInitAuthMutation } from '@/features/auth/hooks/useInitAuthMutation';
	import { useUserInfo } from './entities/user/model/useUserInfo';
	import { useLogoutMutation } from './features/auth/hooks/useLogoutMutation';
	import { onClickOutside } from '@vueuse/core';
	const route = useRoute();
	const userInfo = useUserInfo();

	const { initAuth } = useInitAuthMutation();
	const { logout } = useLogoutMutation();

	const currentPage = computed(() => route.name);

	const displayName = computed(() => userInfo.user.name || userInfo.user.email || 'Профиль ');

	const handleLogout = async () => {
		await logout();
	};

	const dropdownRef = ref<HTMLElement | null>(null);

	onClickOutside(dropdownRef, () => {
		const details = dropdownRef.value?.querySelector('details') as HTMLDetailsElement | null;
		if (details && details.open) {
			details.open = false;
		}
	});

	onMounted(async () => {
		console.log(`refresh onMounted`);
		await initAuth();
	});
</script>

<template>
	<div
		class="wrapper min-w-0 min-h-0 w-full h-full bg-linear-to-br from-slate-900 via-slate-800 to-slate-950 text-slate-100"
	>
		<!-- <p>{{ $route.fullPath }}</p> -->

		<header
			class="sticky top-0 z-10 w-full border-b border-white/10 bg-slate-900/80 backdrop-blur"
		>
			<div
				class="flex max-[500px]:h-20 h-14 w-full items-center gap-4 px-6 md:px-10 py-2 box-border"
			>
				<div class="flex items-center gap-3 text-lg font-semibold">
					<span
						class="inline-flex size-8 items-center justify-center rounded-xl bg-sky-400/20"
					>
						⚡
					</span>
					Fast Events
				</div>
				<RouterLink
					to="/"
					class="px-4 py-2 rounded-full text-sm font-medium transition"
					:class="{
						'bg-white/10 text-white shadow-sm cursor-default underline decoration-2 decoration-white':
							currentPage === 'domain',
						'text-slate-300 hover:text-white hover:bg-white/10':
							currentPage !== 'domain',
					}"
				>
					Главная
				</RouterLink>

				<RouterLink
					to="/events"
					class="px-4 py-2 rounded-full text-sm font-medium transition"
					:class="{
						'bg-white/10 text-white shadow-sm cursor-default underline decoration-2 decoration-white':
							currentPage === 'events',
						'text-slate-300 hover:text-white hover:bg-white/10':
							currentPage !== 'events',
					}"
				>
					События
				</RouterLink>

				<div class="ml-auto" ref="dropdownRef">
					<details v-if="userInfo.isLoggedIn.value" class="relative group">
						<summary
							class="flex cursor-pointer list-none items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-white transition hover:bg-white/20"
						>
							<div class="rounded-full bg-emerald-400 size-2"></div>
							<span class="max-w-30 truncate">{{ displayName }}</span>
							<span class="text-slate-300">▾</span>
						</summary>
						<div
							class="absolute right-0 mt-2 w-44 rounded-xl border border-white/10 bg-slate-900/95 p-2 text-xs shadow-xl"
						>
							<RouterLink
								to="/prophile"
								class="block rounded-lg px-3 py-2 text-slate-200 hover:bg-white/10"
							>
								Профиль
							</RouterLink>
							<button
								type="button"
								class="mt-1 w-full rounded-lg px-3 py-2 text-left text-slate-200 hover:bg-white/10 cursor-pointer"
								@click="handleLogout"
							>
								Выйти
							</button>
						</div>
					</details>
					<div
						v-else-if="!['/auth/login', '/auth/register'].includes($route.path)"
						class="max-[500px]:text-sm text-xs text-slate-300"
					>
						Часть функций недоступна,
						<router-link class="text-sky-300 hover:text-sky-200" to="/auth/login">
							авторизуйтесь!
						</router-link>
					</div>
				</div>
			</div>
		</header>
		<div
			v-if="$route.fullPath === `/`"
			class="p-6 md:p-10 flex gap-10 flex-col min-w-0 min-h-0 w-full h-full"
		>
			<section class="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
				<div class="space-y-6">
					<p class="text-sm uppercase tracking-[0.2em] text-slate-400">
						Платформа событий
					</p>
					<h1 class="text-4xl md:text-5xl font-semibold leading-tight">
						Проводите и находите мероприятия
						<span class="text-sky-300">за пару кликов</span>
					</h1>
					<p class="text-base md:text-lg text-slate-300 max-w-2xl">
						Создавайте мероприятия, находите участников и управляйте всеми деталями в
						одном месте. Мы ускоряем организацию событий и упрощаем участие.
					</p>
					<div class="flex flex-wrap gap-3">
						<router-link
							class="px-5 py-3 rounded-full bg-sky-400 text-slate-900 font-semibold shadow-lg shadow-sky-400/30 hover:bg-sky-300 transition"
							to="/auth/register"
						>
							Начать бесплатно
						</router-link>
						<router-link
							class="px-5 py-3 rounded-full border border-white/20 text-white hover:bg-white/10 transition"
							to="/events"
						>
							Смотреть события
						</router-link>
					</div>
				</div>
				<div class="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl">
					<h2 class="text-lg font-semibold">Быстрый старт</h2>
					<ul class="mt-4 space-y-4 text-sm text-slate-300">
						<li class="flex items-start gap-3">
							<span class="mt-1 size-2 rounded-full bg-sky-300"></span>
							Создайте профиль и опишите формат события.
						</li>
						<li class="flex items-start gap-3">
							<span class="mt-1 size-2 rounded-full bg-sky-300"></span>
							Подберите локацию, дату и ценовые параметры.
						</li>
						<li class="flex items-start gap-3">
							<span class="mt-1 size-2 rounded-full bg-sky-300"></span>
							Соберите участников и общайтесь в одном месте.
						</li>
					</ul>
					<div class="mt-6 rounded-2xl bg-slate-900/70 p-4 text-xs text-slate-400">
						<span class="text-sky-300">Совет:</span> пригласите коллег и делитесь
						событием в соцсетях.
					</div>
				</div>
			</section>

			<section class="grid gap-4 md:grid-cols-3">
				<div class="rounded-2xl bg-white/5 p-5 border border-white/10">
					<p class="text-sm text-slate-400">Организаторам</p>
					<p class="mt-2 text-lg font-semibold">Быстрое создание и управление</p>
				</div>
				<div class="rounded-2xl bg-white/5 p-5 border border-white/10">
					<p class="text-sm text-slate-400">Участникам</p>
					<p class="mt-2 text-lg font-semibold">Удобный поиск и участие</p>
				</div>
				<div class="rounded-2xl bg-white/5 p-5 border border-white/10">
					<p class="text-sm text-slate-400">Командам</p>
					<p class="mt-2 text-lg font-semibold">Согласование и коммуникации</p>
				</div>
			</section>
		</div>

		<router-view
			v-else
			class="p-6 md:p-10 flex min-w-0 w-full box-border h-full min-h-0"
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
