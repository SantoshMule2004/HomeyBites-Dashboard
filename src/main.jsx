import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { MenuItemContext } from './Context/MenuItemContext.jsx'
import { TiffinPlanContext } from './Context/TiffinPlanContext.jsx'
import { SubscriptionContext } from './Context/SubscriptionContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StrictMode>
      <MenuItemContext>
        <TiffinPlanContext>
          <SubscriptionContext>
            <App />
          </SubscriptionContext>
        </TiffinPlanContext>
      </MenuItemContext>
    </StrictMode>
  </BrowserRouter>
)
