import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx' // App.jsx에서 default로 AppWrapper를 내보내고 있습니다.

// App.jsx의 AppWrapper에서 이미 BrowserRouter를 포함하고 있으므로 여기서 제거합니다.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
