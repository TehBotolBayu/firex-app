import React, {useEffect, useState} from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'

function App() {
  const [isLogin, setisLogin] = useState()
  const [user, setuser] = useState({})

  useEffect(() => {
    const token = localStorage.getItem('loginToken');
    const postdata = {
      token
    }
    const isValid = async () => {
      const result = await fetch('http://localhost:3300/v1/auth/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postdata) 
      })
      if (!result.ok) {
        throw new Error('Failed to create post');
      }
      const resdata = await result.json();
      if(resdata.message == "valid token"){
        setuser(resdata);
        setisLogin(true);
        return
      }
      setisLogin(false);
    }
    isValid();
  }, [])
  
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route index element={(isLogin)?<Dashboard user={user}/>:<Login/>} />
        <Route path='/dashboard' element={<Dashboard user={user}/>} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App