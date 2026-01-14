import Domain from '@/components/Domain.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'domain',
            component: Domain,
        },
        {
            path: '/auth',
            name: 'auth',
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import('../pages/auth/AuthWrapper.vue'),
            children: [
                {
                    path: 'login',
                    name: 'login',
                    component: () => import('@/pages/auth/LoginPage.vue'),
                    meta: { isAuthPage: true, title: 'Вход' },
                },
                {
                    path: 'register',
                    name: 'register',
                    component: () => import('@/pages/auth/RegisterPage.vue'),
                    meta: { isAuthPage: true, title: 'Регистрация' },
                },
            ],
        },
    ],
});

export default router;
