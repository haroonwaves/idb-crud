import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { crx } from '@crxjs/vite-plugin';
import svgr from '@honkhonk/vite-plugin-svgr';

import manifest from './manifest.json';

export default defineConfig({
	plugins: [svgr(), preact(), crx({ manifest })],
	resolve: {
		alias: {
			'@': process.cwd(),
		},
	},
});
