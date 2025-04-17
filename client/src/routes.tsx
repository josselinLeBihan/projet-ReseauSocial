import React, { lazy, ReactNode } from "react"
import Home from "./Pages/Home"
import Profile from "./Pages/Profile"
import SignUp from "./Pages/SignUp"
import CommunityHome from "./Pages/CommunityHome"
import CommunityForum from "./Components/Community/CommunityForum"
import CommunityMembers from "./Components/Community/CommunityMembers"
import CommunityAbout from "./Components/Community/CommunityAbout"
import SavedPosts from "./Pages/SavedPosts"

const NotFound = lazy(() => import("./pages/NotFound"))

export interface RouteData {
  path: string
  element: ReactNode
  children?: RouteData[]
}

export const privateRoutes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/profile/:userId",
    element: <Profile />,
  },
  {
    path: "/saved",
    element: <SavedPosts />,
  },
  {
    path: "/community/",
    element: <CommunityHome />,
    children: [
      {
        path: ":communityName/forum",
        element: <CommunityForum />,
      },
      {
        path: ":communityName/about",
        element: <CommunityAbout />,
      },
      {
        path: ":communityName/members/",
        element: <CommunityMembers />,
      },
    ],
  },
]

export const publicRoutes = [
  {
    path: "*",
    element: <NotFound />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
]
