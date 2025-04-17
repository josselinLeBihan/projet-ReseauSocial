import React from "react"
import { UserData } from "../redux/api/type"
import { useAppSelector } from "../redux/store"
import SavedPostMainSection from "../Components/SavedPosts/SavedPostMainSection"

function SavedPosts() {
  const userData: UserData = useAppSelector((state) => state.auth?.userData)

  return <SavedPostMainSection userdata={userData} />
}

export default SavedPosts
