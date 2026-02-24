import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import 'leaflet/dist/leaflet.css'
import { RouterProvider } from 'react-router-dom'
import router from './route/index'
import { Provider } from 'react-redux'
import { store } from './store/store.js'
import GlobalProvider from './provider/GlobalProvider'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <Provider store={store}>
    <GlobalProvider>
      <RouterProvider router={router} />
    </GlobalProvider>
  </Provider>
  // </StrictMode>,
)
