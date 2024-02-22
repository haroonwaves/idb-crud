import { render } from "preact";
import { App } from "../src/app";

const contentRoot = document.createElement("div");
contentRoot.id = "idb-crud-content-root";
document.body.append(contentRoot);

const shadowRoot = contentRoot.attachShadow({ mode: "open" });

render(<App />, shadowRoot);
