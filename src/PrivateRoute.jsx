import React from "react"
import { useMemo, useEffect, useState } from "react"
import { Outlet } from "react-router-dom"
import NavBar from "./Components/shared/NavBar"
import LeftBar from "./Components/shared/LeftBar"
import RightBar from "./Components/shared/RightBar"

function PrivateRoute({ userData }) {
  //TODO vérifier si l'utilisateur est authentifié
  const isAuthenticated = true

  console.log("PrivateRoute")

  return isAuthenticated ? (
    <div className="scroll-smooth">
      <NavBar userData={userData} />
      <div className="flex  w-full justify-between">
        <LeftBar />
        <div className="flex-1 bg-zinc-100 rounded-2xl">
          <Outlet />
        </div>
        <RightBar />
      </div>
    </div>
  ) : (
    <div>Vous n'êtes pas autorisé à accéder à cette page</div>
  )
}

export default PrivateRoute
