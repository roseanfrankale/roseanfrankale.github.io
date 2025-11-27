import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // This applies your global styles

// Find the element with id "root" in your HTML
const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("Failed to find the root element. Make sure index.html has a <div id='root'></div>");
}