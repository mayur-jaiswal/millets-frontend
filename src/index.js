import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";  // Ensure correct path
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

serviceWorkerRegistration.register(); 

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);