import { render } from "preact";
import { App } from "../src/app";

const contentRoot = document.createElement("div");
document.body.append(contentRoot);
render(<App />, contentRoot);
