import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// HTML의 root 영역에 React 앱을 표시합니다.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
