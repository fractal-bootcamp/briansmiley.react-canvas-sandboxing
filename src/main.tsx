import React from "react";
import ReactDOM from "react-dom/client";
// import App from "./App.tsx";
import "./index.css";
import { KonvaStage } from "./components/KonvaCanvas.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* <App /> */}
    <KonvaStage />
  </React.StrictMode>
);
