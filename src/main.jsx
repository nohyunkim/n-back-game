// src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from "./contexts/AuthContext"; // 추가

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider> {/* 앱 전체를 AuthProvider로 감쌉니다. */}
      <App />
    </AuthProvider>
  </StrictMode>,
)