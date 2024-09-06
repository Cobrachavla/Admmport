import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { AuthProvider } from './Context/AuthContext'
import { ProductProvider } from './Context/ProductContext'
import { CartProvider } from './Context/CartContext'
import { FavoriteProvider } from './Context/FavoriteContext'
import { BrowserRouter } from 'react-router-dom'
import { UserProvider } from './Pages/Cart/UserContext'

ReactDOM.render(
  <React.StrictMode>
    <UserProvider>
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <FavoriteProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </FavoriteProvider>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
   </UserProvider>
  </React.StrictMode>,
  document.getElementById("root")
)

