import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

async function prepareApp() {
  if (typeof window !== 'undefined') {
    const { worker } = await import('./mocks/browser')
    await worker.start({
      serviceWorker: {
        url: '/mockServiceWorker.js',
      },
      quiet: true,
    })
  }
}

prepareApp().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  )
})
