<script setup lang="ts">
    import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
    <div class="wrapper min-w-0 min-h-0 w-full h-full max-w-full">
        <!-- <p>{{ $route.fullPath }}</p> -->
        <router-view></router-view>
        <router-link v-if="$route.fullPath === `/`" to="/auth/register">Регистрация</router-link>
    </div>
</template>

<style scoped lang="css">
    .wrapper {
        display: flex;
        place-items: flex-start;
        flex-wrap: wrap;
        height: 100vh;
        width: 100vw;
    }
</style>
