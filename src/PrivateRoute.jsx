import React from "react"
import { useMemo, useEffect, useState } from "react"
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
      <div className="">
        <LeftBar />
        <RightBar />
      </div>
    </div>
  ) : (
    <div>Vous n'êtes pas autorisé à accéder à cette page</div>
  )
}

export default PrivateRoute
