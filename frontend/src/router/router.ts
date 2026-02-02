import Domain from '@/pages/domain/Domain.vue';
import CreateEventPage from '@/pages/event/CreateEventPage.vue';
import EventPage from '@/pages/event/EventPage.vue';
import EventsPage from '@/pages/event/EventsPage.vue';
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
			path: '/events',
			name: 'events',
			component: EventsPage,
			children: [
				{
					path: ':eventId',
					name: 'event',
					component: EventPage,
					meta: { hideParent: true },
				},
				{
					path: 'create-event',
					name: 'create-event',
					component: CreateEventPage,
					meta: { hideParent: true },
				},
			],
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
