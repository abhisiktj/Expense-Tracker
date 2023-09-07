import React, { Children, useState } from 'react';
import ReactDom from 'react-dom/client';
import { createBrowserRouter,Outlet,RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './src/utils/store';
import { useSelector } from 'react-redux';
//importing components

import Register from './src/components/Register';
import Navigation  from './src/components/Navigation';
import Error  from './src/components/Error';
import Login from './src/components/Login';
import Dashboard from './src/components/Dashboard';
import Profile from './src/components/Profile';
import Salaries from './src/components/Salaries';
import Expenses from './src/components/Expenses';
import Homepage from './src/components/Homepage';
import Protected from './src/components/Protected';


//importing contexts

import expenseContext from './src/utils/contexts/expenseContext';
import salaryContext from './src/utils/contexts/salaryContext';
import userContext from './src/utils/contexts/userContext';


const NavigationLayout=()=>{

  const[expenses,setExpenses]=useState([]);
  const[salaries,setSalaries]=useState([]);
  const [user,setUser]=useState({});


    return(
      <userContext.Provider value={{user,setUser}}>
      <salaryContext.Provider value={{salaries,setSalaries}}>
      <expenseContext.Provider value={{expenses, setExpenses}}>
      <Provider store={store}>
       <Protected Component={Navigation} />
       <Outlet  />
      </Provider>
      </expenseContext.Provider >
      </salaryContext.Provider>
      </userContext.Provider>
     
    )
}

const AuthenticationLayout=()=>{
    return(
      <Provider store={store}>
        <Outlet />
      </Provider>
 
    )
}

const appRouter = createBrowserRouter([
    {
        path:'/home',
        element:<Homepage />,
        errorElement:<Error />
    },
    
    {
      path: "/",
      element: <NavigationLayout />,
      errorElement: <Error />,
      children: [

        {
         path: "/dashboard",
         element: <Protected Component={Dashboard} />
        },
        {
          path:"/profile",
          element:<Protected Component={Profile} />
        },
        {
          path:"/salaries",
          element:<Protected Component={Salaries} />
        },
        {
          path:"/expenses",
          element:<Protected Component={Expenses} />
        }
      ],
    },
    {
       path:"/auth",
       element:<AuthenticationLayout />,
       errorElement: <Error />,
       children: [
          {
            path: "login",
            element: <Login />,
          },
          {
             path: "register",
             element: < Register/>,
           },
        ],
 
    }
  ]);



const root=ReactDom.createRoot(document.getElementById('root'));
root.render(<RouterProvider router={appRouter} />);