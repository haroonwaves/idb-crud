import { render } from 'preact';
import { App } from './App';

import tailwind from './index.css?inline';

const fontLink = document.createElement('link');
fontLink.href =
	'https://fonts.googleapis.com/css2?family=Archivo:ital,wdth,wght@0,62..125,100..900;1,62..125,100..900&display=swap';
fontLink.rel = 'stylesheet';
document.head.append(fontLink);

const contentRoot = document.createElement('div');
contentRoot.id = 'idb-crud-content-root';

const extensionStyle = document.createElement('style');
extensionStyle.innerHTML = `${tailwind}`;

document.body.append(contentRoot);

const shadowRoot = contentRoot.attachShadow({ mode: 'open' });

shadowRoot.append(extensionStyle);

render(<App />, shadowRoot);
