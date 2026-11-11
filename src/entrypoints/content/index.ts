import { createShadowRootUi } from '#imports';
import { render, h } from 'preact';
import { App } from './App';
import './content.css';
import { setShadowRoot } from '@/lib/utils';

export default defineContentScript({
	matches: ['<all_urls>'],
	cssInjectionMode: 'ui',
	async main(ctx) {
		const ui = await createShadowRootUi(ctx, {
			name: 'idb-crud',
			position: 'inline',
			anchor: 'body',
			append: 'last',
			onMount: (container) => {
				const shadowRoot = container.getRootNode() as ShadowRoot;
				setShadowRoot(shadowRoot);

				// Keep the extension alive if an aggressive SPA wipes the body
				const hostElement = shadowRoot.host;
				const intervalId = setInterval(() => {
					if (document.body && !document.body.contains(hostElement)) {
						document.body.append(hostElement);
					}
				}, 2000);

				const fontLink = document.createElement('link');
				fontLink.href =
					'https://fonts.googleapis.com/css2?family=Archivo:ital,wdth,wght@0,62..125,100..900;1,62..125,100..900&display=swap';
				fontLink.rel = 'stylesheet';
				document.head.append(fontLink);

				const wrapper = document.createElement('div');
				wrapper.id = 'idb-crud-content-root';
				container.append(wrapper);

				render(h(App, null), wrapper);
				return { fontLink, wrapper, intervalId };
			},
			onRemove: (mounted) => {
				if (!mounted) return;
				clearInterval(mounted.intervalId);
				render(null, mounted.wrapper);
				mounted.wrapper.remove();
				mounted.fontLink?.remove();
			},
		});

		ui.mount();
	},
});
