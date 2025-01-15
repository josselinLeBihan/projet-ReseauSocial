import React, { useState } from "react"
import ComonLoading from "../Loader/ComonLoading"

function MainSection() {
  const [isLoading, setIsLoading] = useState(true)

  if (isLoading) {
    return <ComonLoading />
  }

  return <div>MainSection</div>
}

export default MainSection
