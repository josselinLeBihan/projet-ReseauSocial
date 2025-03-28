import React from "react"
import MainSection from "../Components/Home/MainSection"
import { UserData } from "../redux/api/type"
import { useAppSelector } from "../redux/store"

function Home() {
  const userData: UserData = useAppSelector((state) => state.auth?.userData)

  return <MainSection userdata={userData} />
}

export default Home
