import * as React from "react";
import { render } from "react-dom";
import { App } from "./components/App";

const el = document.createElement("div");
el.style.position = "fixed";
el.style.zIndex = "2147483647";
el.style.width = "100%";
el.style.height = "100%";

render(<App />, document.body.appendChild(el));
