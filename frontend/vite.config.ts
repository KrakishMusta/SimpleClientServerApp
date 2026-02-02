import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import VitePluginVueDevTools from 'vite-plugin-vue-devtools';

export default defineConfig({
	plugins: [vue(), VitePluginVueDevTools(), tailwindcss()],

	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},

	define: {
		'import.meta.env.BASE_URL': JSON.stringify('/'),
	},

	server: {
		host: '0.0.0.0', // 🔥 ОБЯЗАТЕЛЬНО
		port: 5173,
		strictPort: true,

		proxy: {
			'/api': {
				target: 'http://89.189.172.46:3000', // 🔥 внешний IP
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, ''),
			},
		},
	},
});
