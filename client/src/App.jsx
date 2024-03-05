import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'

function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route index element={<div>home</div>} />
        <Route path='/dashboard' element={<Dashboard/>} />
        <Route path='/login' element={<Login/>} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App