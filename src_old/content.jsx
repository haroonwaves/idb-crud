import { render } from 'preact';
import { App } from './app';

import tailwind from './index.css?inline';
import appStyles from './styles/app.scss?inline';
import hostStyles from './styles/host.scss?inline';

const fontLink = document.createElement('link');
fontLink.href =
	'https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap';
fontLink.rel = 'stylesheet';
document.head.appendChild(fontLink);

const contentRoot = document.createElement('div');
contentRoot.id = 'idb-crud-content-root';

const hostStyle = document.createElement('style');
hostStyle.innerHTML = `${hostStyles}`;

const extensionStyle = document.createElement('style');
extensionStyle.innerHTML = `${tailwind} ${appStyles}`;

document.body.append(contentRoot, hostStyle);

const shadowRoot = contentRoot.attachShadow({ mode: 'open' });

shadowRoot.append(extensionStyle);

render(<App />, shadowRoot);
