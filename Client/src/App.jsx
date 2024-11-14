import React, { useEffect, useState } from 'react'
import { BrowserRouter,Routes,Route, Navigate } from 'react-router-dom'
import Auth from './pages/Auth.jsx'
import Chat from './pages/Chat.jsx'
import Profile from './pages/Profile.jsx'
import { useAppStore } from './store/store.js'
import apiClient from './lib/apiClient.js'
import { GET_USER_INFO } from './utils/constants.js'

const PrivateRoute=({children})=>{
  const {userInfo} = useAppStore()
  const isAuthenticated =!! userInfo
  return isAuthenticated ? children :<Navigate to ="/auth"/>
}

const AuthRoute=({children})=>{
  const {userInfo} = useAppStore()
  const isAuthenticated =!! userInfo
  return isAuthenticated ? <Navigate to ="/chat"/> : children 
}

const App = () => {

  const  {userInfo, setUserInfo} = useAppStore()
  const [loading,setLoading]= useState(true)

  useEffect (() => {
    const getUserData=async()=>{
      try {
      const  res = await apiClient.get(GET_USER_INFO, {withCredentials:true})
      if(res.status===201 && res.data.id){
        setUserInfo(res.data)
      }
      else{
        setUserInfo(undefined)
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setUserInfo(undefined)
      }
      }
      finally{
        setLoading(false)
      }
    }
    if(!userInfo){
      getUserData()
    }else{
      setLoading(false)
    }
  },[userInfo, setUserInfo])

  if(loading)
    {
      return <div>Loading...</div>  
    }
  return (
    
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/auth' element={<AuthRoute><Auth/></AuthRoute>}/>
          <Route path='/chat' element={<PrivateRoute><Chat/></PrivateRoute>}/>
          <Route path='/profile' element={<PrivateRoute><Profile/></PrivateRoute>}/>
          <Route path='*' element={<Navigate to='/auth'/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}
export default App
