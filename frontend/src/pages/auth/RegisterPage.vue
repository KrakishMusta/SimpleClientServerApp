<script setup lang="ts">
    import { useRegisterMutation } from '@/features/register/hooks/useRegisterMutation';
    import { ref } from 'vue';

    const { register } = useRegisterMutation();

    const emailRef = ref(``);
    const usernameRef = ref(``);
    const passwordRef = ref(``);
    const submitRegisterFormHandler = () => {
        const payload = {
            email: emailRef.value,
            name: usernameRef.value,
            password: passwordRef.value,
        };
        register({ values: payload });
    };
</script>

<template>
    <div class="flex flex-col gap-2 p-4 shadow shadow-gray-800 rounded-xl">
        <h1 class="font-semibold">Регистрация</h1>
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
                <label for="name">name</label>
                <input
                    v-model="usernameRef"
                    class="border border-solid rounded-md"
                    type="text"
                    id="name"
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
            @click="submitRegisterFormHandler"
        >
            Отправить
        </button>
    </div>
</template>

<style scoped lang="css"></style>
