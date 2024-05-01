import { render } from "preact";
import { App } from "../src/app";

import tailwind from "./index.css?inline";
import appStyles from "./styles/app.scss?inline";
import hostStyles from "./styles/host.scss?inline";

const contentRoot = document.createElement("div");
contentRoot.id = "idb-crud-content-root";

const hostStyle = document.createElement("style");
hostStyle.innerHTML = `${hostStyles}`;

const extensionStyle = document.createElement("style");
extensionStyle.innerHTML = `${tailwind} ${appStyles}`;

document.body.append(contentRoot, hostStyle);

const shadowRoot = contentRoot.attachShadow({ mode: "open" });

shadowRoot.append(extensionStyle);

render(<App />, shadowRoot);
