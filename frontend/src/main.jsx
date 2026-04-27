/**
 * main.jsx
 *
 * Application entry point.
 *
 * Responsibilities:
 * - Mounts the React application to the DOM
 * - Wraps the app with global providers
 *   - BrowserRouter for routing
 *   - AuthProvider for authentication state
 * - Initializes global styles and i18n configuration
 *
 * Notes:
 * - This is the first file executed by Vite
 * - All global context providers should be added here
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import AuthProvider from "./features/auth/context/AuthProvider";
import "./styles/styles.css";
import "./i18n";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
