import Domain from '@/pages/domain/Domain.vue';
import CreateEventPage from '@/pages/event/CreateEventPage.vue';
import EventPage from '@/pages/event/EventPage.vue';
import EventsPage from '@/pages/event/EventsPage.vue';
import UserProphile from '@/pages/user/UserProphile.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'domain',
			component: Domain,
			meta: {
				title: 'Кратко',
			},
		},
		{
			path: '/events',
			name: 'events',
			component: EventsPage,
			meta: { title: 'Мероприятия' },
			children: [
				{
					path: ':eventId',
					name: 'event',
					component: EventPage,
					meta: { hideParent: true, title: 'Мероприятие' },
				},
				{
					path: 'create-event',
					name: 'create-event',
					component: CreateEventPage,
					meta: { hideParent: true, title: 'Создание мероприятия' },
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
		{
			path: '/prophile',
			name: 'user-prophile',
			component: UserProphile,
		},
	],
});

router.afterEach((to) => {
	const baseTitle = 'MyApp';

	if (typeof to.meta.title === 'function') {
		document.title = to.meta.title(to);
	} else if (to.meta.title) {
		document.title = `${to.meta.title}`;
	} else {
		document.title = baseTitle;
	}
});

export default router;
