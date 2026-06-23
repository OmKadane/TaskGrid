import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { TaskGridProvider } from "./context/TaskGridContext.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <TaskGridProvider>
      <App />
    </TaskGridProvider>
  </StrictMode>,
);
