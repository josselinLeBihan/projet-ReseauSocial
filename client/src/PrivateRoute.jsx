import React from "react"
import { useMemo, useEffect, useState } from "react"
import { Navigate, Outlet, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { setInitialAuthState } from "./redux/actions/authActions"

import NavBar from "./Components/shared/NavBar"
import LeftBar from "./Components/shared/LeftBar"
import RightBar from "./Components/shared/RightBar"

function PrivateRoute({ userData }) {
  const isAuthenticated = useMemo(() => {
    return (userData, accessToken) => {
      return userData && accessToken
    }
  }, [])

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const token = localStorage.getItem("profile")
  const accessToken = JSON.parse(token)?.accessToken

  useEffect(() => {
    if (!isAuthenticated(userData, accessToken)) {
      dispatch(setInitialAuthState(navigate))
    }
  }, [dispatch, navigate, userData, accessToken, isAuthenticated])

  return isAuthenticated ? (
    <div className="scroll-smooth bg-gray-50">
      <NavBar userData={userData} />
      <div className="flex  w-full justify-between">
        <LeftBar />
        <div className="flex-1 bg-zinc-100 rounded-2xl p-8">
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
