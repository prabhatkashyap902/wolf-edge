import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import Login from '../Login/Login'
import Home from '../Home/Home'
import { isLoggedIn } from '../Utils/Utils'


function normalizePath(path) {
    return path.replace(/\/+/g, '/')
  }
const Auth = () => {
    const location=useLocation();

    const normalizedPath = normalizePath(location.pathname)


    const isLogged=localStorage.getItem(isLoggedIn)
    if(isLogged) {
      
      return normalizedPath.includes('login') ? <Navigate to={'/'} />:<Outlet/>}
    else  return normalizedPath.includes('login')?<Outlet/>:<Navigate to={'/login'}/>

 
}

export default Auth