import { lazy } from "react"
import Home from "./Pages/Home"
import Profile from "./Pages/Profile"

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
]

export const publicRoutes = [
  {
    path: "*",
    element: <NotFound />,
  },
]
