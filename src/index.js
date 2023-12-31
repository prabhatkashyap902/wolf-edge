import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';
import Login from './Components/Login/Login';
import Auth from './Components/Auth/Auth';
import Home from './Components/Home/Home';
import { Provider } from 'react-redux';
import { ReduxStore } from './Components/Redux/ReduxStore';

const root = ReactDOM.createRoot(document.getElementById('root'));

const router= createBrowserRouter([{
  path:'/',
  element:<Auth/>,
  children:[{
    path:'/',
    element:<Home/>
  },{
    path:'/login',
    element:<Auth/>,
    children:[{
      path:'',
      element:<Login/>
    }]
  }]
}])

root.render(
    <Provider store={ReduxStore}>
        <RouterProvider router={router} />
    </Provider>
);
