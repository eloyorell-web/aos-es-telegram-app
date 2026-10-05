import React from 'react'
import ReactDOM from 'react-dom/client'
import bridge from '@vkontakte/vk-bridge'
import {HashRouter} from 'react-router-dom'
import App from './App'

bridge.send('VKWebAppInit')
  .then((data) => {
    if (data.result) {
      console.log('VK Bridge успешно инициализирован')
    }
  })
  .catch((error) => console.error('Ошибка инициализации VK:', error))

if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js')
      .catch(error => console.error('Service worker registration failed:', error))
  })
}

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
)
