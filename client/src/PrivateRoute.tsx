import React from "react"
import { useMemo, useEffect, useState } from "react"
import { Navigate, Outlet, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { setInitialAuthState } from "./redux/actions/authActions"
import { UserData } from "./App"

import NavBar from "./Components/shared/NavBar"
import LeftBar from "./Components/shared/LeftBar"
import RightBar from "./Components/shared/RightBar"
import { useAppDispatch } from "./redux/store"

interface PrivateRouteProps {
  userData: UserData
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ userData }) => {
  const isAuthenticated = useMemo(() => {
    return (userData, accessToken) => {
      return userData && accessToken
    }
  }, [])

  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const token = localStorage.getItem("profile")
  const accessToken = token ? JSON.parse(token)?.accessToken : null

  useEffect(() => {
    if (!isAuthenticated(userData, accessToken)) {
      dispatch(setInitialAuthState(navigate))
    }
  }, [dispatch, navigate, userData, accessToken, isAuthenticated])

  return isAuthenticated ? (
    <div className="scroll-smooth bg-gray-50">
      <NavBar userData={userData} />
      <div className="flex  w-full justify-between pt-24">
        <LeftBar userData={userData} />
        <div className="flex-1 bg-zinc-100 rounded-2xl p-8 overflow-auto h-full mx-72">
          <Outlet />
        </div>
        <RightBar userData={userData} />
      </div>
    </div>
  ) : (
    <Navigate to="/signin" />
  )
}

export default PrivateRoute
