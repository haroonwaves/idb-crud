import { render } from "preact";
import { App } from "../src/app";

import tailwind from "./index.css?inline";
import appStyles from "./styles/app.scss?inline";

const contentRoot = document.createElement("div");
contentRoot.id = "idb-crud-content-root";

const style = document.createElement("style");
style.innerHTML = `${tailwind} ${appStyles}`;

document.body.append(contentRoot);

const shadowRoot = contentRoot.attachShadow({ mode: "open" });

shadowRoot.append(style);

render(<App />, shadowRoot);
