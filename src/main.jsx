import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { MenuItemContext } from './Context/MenuItemContext.jsx'
import { TiffinPlanContext } from './Context/TiffinPlanContext.jsx'
import { SubscriptionContext } from './Context/SubscriptionContext.jsx'
import { UserContext } from './Context/UserContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StrictMode>
      <UserContext>
        <MenuItemContext>
          <TiffinPlanContext>
            <SubscriptionContext>
              <App />
            </SubscriptionContext>
          </TiffinPlanContext>
        </MenuItemContext>
      </UserContext>
    </StrictMode>
  </BrowserRouter>
)
