import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import Login from '../Login/Login'
import Home from '../Home/Home'


function normalizePath(path) {
    return path.replace(/\/+/g, '/')
  }
const Auth = () => {
    const location=useLocation();

    const normalizedPath = normalizePath(location.pathname)


    const isLoggedIn=localStorage.getItem('isLoggedIn')
    console.log(isLoggedIn)
    if(isLoggedIn) {
      console.log("yes")
      return normalizedPath.includes('login') ? <Navigate to={'/'} />:<Outlet/>}
    else  return normalizedPath.includes('login')?<Outlet/>:<Navigate to={'/login'}/>

 
}

export default Auth