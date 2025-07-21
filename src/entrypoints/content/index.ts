import { createShadowRootUi } from '#imports';
import { render } from 'preact';
import { App } from './App';
import './content.css';

export default defineContentScript({
	matches: ['<all_urls>'],
	cssInjectionMode: 'ui',
	async main(ctx) {
		const ui = await createShadowRootUi(ctx, {
			name: 'idb-crud',
			position: 'inline',
			anchor: 'body',
			append: 'first',
			onMount: (container) => {
				const fontLink = document.createElement('link');
				fontLink.href =
					'https://fonts.googleapis.com/css2?family=Archivo:ital,wdth,wght@0,62..125,100..900;1,62..125,100..900&display=swap';
				fontLink.rel = 'stylesheet';
				document.head.appendChild(fontLink); // eslint-disable-line unicorn/prefer-dom-node-append

				const wrapper = document.createElement('div');
				wrapper.id = 'idb-crud-content-root';
				container.append(wrapper);

				render(App(), wrapper); // eslint-disable-line new-cap
				return { wrapper };
			},
			onRemove: (mounted) => {
				if (!mounted) return;
				render(null, mounted.wrapper);
				mounted.wrapper.remove();
			},
		});

		ui.mount();
	},
});
