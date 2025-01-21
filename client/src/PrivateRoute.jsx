import React from "react"
import { useMemo, useEffect, useState } from "react"
import { Navigate, Outlet } from "react-router-dom"
import NavBar from "./Components/shared/NavBar"
import LeftBar from "./Components/shared/LeftBar"
import RightBar from "./Components/shared/RightBar"

function PrivateRoute({ userData }) {
  //TODO vérifier si l'utilisateur est authentifié
  const isAuthenticated = false

  useEffect(() => {
    if (!isAuthenticated) {
      //TODO
    }
  }, [])

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
