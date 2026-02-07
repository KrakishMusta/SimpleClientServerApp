<script setup lang="ts">
	import { useLoginMutation } from '@/features/auth/hooks/useLoginMutation';
	import { ref } from 'vue';

	const { login } = useLoginMutation();

	const emailRef = ref(``);
	const passwordRef = ref(``);
	const submitLoginFormHandler = () => {
		const payload = {
			email: emailRef.value,
			password: passwordRef.value,
		};
		login({ values: payload });
	};
</script>

<template>
	<div class="flex-col gap-2 shadow shadow-gray-800 rounded-xl">
		<h1 class="font-semibold">Вход</h1>
		<div class="flex flex-col gap-1">
			<div class="flex flex-col gap-1">
				<label for="email">email</label>
				<input
					v-model="emailRef"
					class="border border-solid rounded-md"
					type="email"
					id="email"
				/>
			</div>
			<div class="flex flex-col gap-1">
				<label for="password">password</label>
				<input
					v-model="passwordRef"
					class="border border-solid rounded-md"
					type="text"
					id="password"
				/>
			</div>
		</div>

		<button
			class="w-full cursor-pointer bg-gray-900 text-slate-200 p-2 rounded-md"
			type="button"
			@click="submitLoginFormHandler"
		>
			Вход
		</button>

		<router-link to="/auth/register">Регистрация</router-link>
	</div>
</template>

<style scoped lang="css"></style>
