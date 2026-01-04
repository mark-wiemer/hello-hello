import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { FluentProvider, webDarkTheme } from "@fluentui/react-components";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <FluentProvider
            theme={webDarkTheme}
            style={{ display: "flex", flexDirection: "column", width: "100vw", height: "100vh" }}
        >
            <App />
        </FluentProvider>
    </React.StrictMode>,
);
