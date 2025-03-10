import React from "react"
import { useMemo, useEffect, useState } from "react"
import { Navigate, Outlet, useNavigate } from "react-router-dom"
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
    <div className="scroll-smooth bg-gray-50 flex min-h-screen">
      <NavBar userData={userData} />
      <div className="flex w-full justify-between pt-24 min-h-screen ">
        <LeftBar userData={userData} />

        <div className="flex-1 bg-gray-100 rounded-t-[40px] p-8 mx-72 h-full border-gray-200 border">
          <Outlet />
        </div>

        <RightBar />
      </div>
    </div>
  ) : (
    <Navigate to="/signin" />
  )
}

export default PrivateRoute
