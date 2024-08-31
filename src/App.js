import React from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Navbar from './Components/Navbar'
import Signin from './Pages/Auth/Signin'
import Signup from './Pages/Auth/Signup'
import Products from './Pages/Products'
import Error404 from './Pages/Error404'
import Container from './Components/Container'
import ProductDetail from './Pages/ProductDetail'
import Cart from './Pages/Cart'
import Favorites from './Pages/Favorites'
import Filter from './Components/Filter'
import Colldash from './Components/CollegeDashboard'
import AdminDashboard from './Components/AdminDashboard'

function App() {
  return (
    <div className="container mx-auto">
      <Navbar />
      <Container>
        <Routes>
        <Route path="/admin-dashboard" exact element={<AdminDashboard />} />  
        <Route path="/filter" exact element={<Filter />} />
        <Route path="/dashboard" exact element={<Colldash />} />
          <Route path="/" exact element={<Products />} />
          <Route path="/:category_id" element={<Products />} />
          <Route path="/product/:product_id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Error404 />} />
        </Routes>
      </Container>
    </div>
  )
}

export default App