import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from "./context/AuthContext.jsx";
import { LoadingProvider } from "./context/LoadingContext";

// Auth and LoadingProvider are contexts. We wrap our app in react's "state stystem"
// Context = A shared “global storage” for your whole UI
// Without context:
// every component manages its own state
// components can’t easily share state
// you have to pass props down through many layers (prop drilling)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <LoadingProvider>
      <AuthProvider>
        <App />
    </AuthProvider>
  </LoadingProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
