import React, { useEffect, useState } from 'react'
import { BrowserRouter,Routes,Route, Navigate } from 'react-router-dom'
import Auth from './pages/auth/Auth'
import Chat from './pages/chat/Chat'
import Profile from './pages/profile/Profile'
import { useAppStore } from './store/store'
import apiClient from './lib/apiClient'
import { GET_USER_INFO } from './utils/constants'

const PrivateRoute=({children})=>{
  const {userInfo} = useAppStore()
  const isAuthenticated =!! userInfo
  return isAuthenticated ? children :<Navigate to ="/auth"/>
}
const AuthRoute=({children})=>{
  const {userInfo} = useAppStore()
  const isAuthenticated =!! userInfo
  return isAuthenticated ?<Navigate to ="/auth"/> : children 
}

const App = () => {

  const  {userInfo, setUserInfo} = useAppStore()
  const [loading,setLoading]= useState(true)

  useEffect (() => {
    const getUserData=async()=>{
      try {
      const  res = await apiClient.get(GET_USER_INFO, {withCredentials:true})
      console.log(res)
      } catch (error) {
        console.log(error)
      }
    }
    if(!userInfo)
    {
      getUserData()
    }
    else
    {
      setLoading(false)
    }
    if(loading)
    {
      return <div>Loading...</div>  
    }

  },[userInfo,setUserInfo])


  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/auth' element={<AuthRoute><Auth/></AuthRoute>}/>
          <Route path='*' element={<Navigate to='/auth'/>}/>
          <Route path='/chat' element={<PrivateRoute><Chat/></PrivateRoute>}/>
          <Route path='/profile' element={<PrivateRoute><Profile/></PrivateRoute>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
