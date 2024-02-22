import { render } from "preact";
import { App } from "../src/app";

import appStyle from "../src/styles/app.scss?inline";
import tailwind from "./index.css?inline";

const contentRoot = document.createElement("div");
contentRoot.id = "idb-crud-content-root";

const style = document.createElement("style");
style.innerHTML = `${tailwind} ${appStyle}`;

document.body.append(contentRoot);

const shadowRoot = contentRoot.attachShadow({ mode: "open" });

shadowRoot.appendChild(style);

render(<App />, shadowRoot);
