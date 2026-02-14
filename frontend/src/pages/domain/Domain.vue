<script setup lang="ts"></script>

<template>
	<div class="flex-col gap-10">
		<section class="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
			<div class="space-y-6">
				<p class="text-sm uppercase tracking-[0.2em] text-slate-400">Платформа событий</p>
				<h1 class="text-4xl md:text-5xl font-semibold leading-tight">
					Проводите и находите мероприятия
					<span class="text-sky-300">за пару кликов</span>
				</h1>
				<p class="text-base md:text-lg text-slate-300 max-w-2xl">
					Создавайте мероприятия, находите участников и управляйте всеми деталями в одном
					месте. Мы ускоряем организацию событий и упрощаем участие.
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
					<span class="text-sky-300">Совет:</span> пригласите коллег и делитесь событием в
					соцсетях.
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
</template>

<style scoped lang="css"></style>
