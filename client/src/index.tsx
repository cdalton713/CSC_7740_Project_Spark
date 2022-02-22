import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "@elastic/eui/dist/eui_theme_light.css";
import "@elastic/charts/dist/theme_light.css";

import { EuiProvider } from "@elastic/eui";
ReactDOM.render(
  <React.StrictMode>
    <EuiProvider colorMode={"light"}>
      <App />
    </EuiProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
