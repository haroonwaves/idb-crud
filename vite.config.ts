import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { crx } from '@crxjs/vite-plugin';

import manifest from './manifest.json';

export default defineConfig({
	plugins: [preact(), crx({ manifest })],
	build: {
		// rollupOptions: {
		// 	output: {
		// 		manualChunks: {
		// 			'preact-vendor': ['preact', 'preact/hooks', 'preact/compat', '@preact/signals'],
		// 			'modules-vendor': ['react-json-view', 'streamsaver', 'oboe', 'lucide-react'],
		// 		},
		// 	},
		// },
		chunkSizeWarningLimit: 600,
	},
	resolve: {
		alias: {
			'@': process.cwd(),
		},
	},
});
