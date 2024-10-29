import { createRoot } from 'react-dom/client'
import App from '@/App'
import '../Client/src/index.css'
import { Toaster } from '@/components/ui/sonner.jsx'

createRoot(document.getElementById('root')).render(
  <>
    <App />
    <Toaster closeButton/>
  </>,
)
