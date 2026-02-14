<script setup lang="ts">
	import { useRoute } from 'vue-router';

	import { onClickOutside } from '@vueuse/core';
	import { computed, ref } from 'vue';
	import { useUserInfo } from '@/entities/user/model/useUserInfo';
	import { useLogoutMutation } from '@/features/auth/hooks/useLogoutMutation';

	const route = useRoute();
	const userInfo = useUserInfo();
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
</script>

<template>
	<header class="sticky top-0 z-10 w-full border-b border-white/10 bg-slate-900/80 backdrop-blur">
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
					'text-slate-300 hover:text-white hover:bg-white/10': currentPage !== 'domain',
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
					'text-slate-300 hover:text-white hover:bg-white/10': currentPage !== 'events',
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
</template>

<style scoped lang="css"></style>
