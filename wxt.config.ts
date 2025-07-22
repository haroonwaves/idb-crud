import { defineConfig } from 'wxt';
import preact from '@preact/preset-vite';
import pkg from './package.json';

export default defineConfig({
	srcDir: 'src',
	outDir: 'dist',
	vite: () => ({
		plugins: [preact() as any],
		react: 'preact/compat',
		'react-dom/test-utils': 'preact/test-utils',
		'react-dom': 'preact/compat',
		'react/jsx-runtime': 'preact/jsx-runtime',
		define: {
			'process.env.APP_VERSION': JSON.stringify(pkg.version),
		},
		build: {
			minify: 'terser',
			terserOptions: {
				compress: {
					drop_console: true,
					drop_debugger: true,
				},
			},
		},
	}),
	manifest: {
		homepage_url: 'https://github.com/haroonwaves/idb-crud',
		author: { email: 'haroonusman00@gmail.com' },
		permissions: ['activeTab', 'storage'],
		action: {},
	},
	alias: {
		'@': process.cwd(),
	},
});
