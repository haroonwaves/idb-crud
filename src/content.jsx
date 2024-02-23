import { render } from "preact";
import { App } from "../src/app";

import tailwind from "./index.css?inline";

const contentRoot = document.createElement("div");
contentRoot.id = "idb-crud-content-root";

const style = document.createElement("style");
style.innerHTML = `${tailwind}`;

document.body.append(contentRoot);

const shadowRoot = contentRoot.attachShadow({ mode: "open" });

shadowRoot.appendChild(style);

render(<App />, shadowRoot);
