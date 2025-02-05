import React, { lazy, ReactNode } from "react"
import Home from "./Pages/Home"
import Profile from "./Pages/Profile"
import SignUp from "./Pages/SignUp"
import CommunityHome from "./Pages/CommunityHome"
import CommunityForum from "./Components/Community/CommunityForum"
import CommunityMembers from "./Components/Community/CommunityMembers"
import CommunityAbout from "./Components/Community/CommunityAbout"

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
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/community/",
    element: <CommunityHome />,
    children: [
      {
        path: "forum/:communityName",
        element: <CommunityForum />,
      },
      {
        path: "about/:communityName",
        element: <CommunityMembers />,
      },
      {
        path: "members/:communityName",
        element: <CommunityAbout />,
      },
    ],
  },
  {
    path: "/community/about/:communityName",
    element: <CommunityHome />,
  },
  {
    path: "/community/members/:communityName",
    element: <CommunityHome />,
  },
  {
    path: "/community/:communityName",
    element: <CommunityHome />,
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
