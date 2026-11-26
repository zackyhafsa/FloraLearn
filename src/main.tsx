import ReactDOM from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { getRouter } from './router'

document.documentElement.classList.toggle(
  'dark',
  localStorage.getItem('ekostream_theme') === 'dark',
)

const router = getRouter()

const rootElement = document.getElementById('app')!

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(<RouterProvider router={router} />)
}
