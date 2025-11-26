import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
    <StrictMode>
          <App />
    </StrictMode>
 
)

// The new version adds a <StrictMode> component to wrap the <App /> component. This is a good practice to ensure that the code is written in a safe and controlled environment.