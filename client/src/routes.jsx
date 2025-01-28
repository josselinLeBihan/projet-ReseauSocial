import { lazy } from "react"
import Home from "./Pages/Home"
import Profile from "./Pages/Profile"
import SignUp from "./Pages/SignUp"
import CommunityHome from "./Pages/CommunityHome"

const NotFound = lazy(() => import("./pages/NotFound"))

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
