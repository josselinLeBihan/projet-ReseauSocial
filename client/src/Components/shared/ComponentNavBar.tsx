import React from "react"
import { NavLink } from "react-router-dom"

function ComponentNavBar({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex justify-center items-center px-6 py-2 border-b-2 border-gray-50 hover:border-teal-600 transition ${
          isActive ? "border-teal-600" : ""
        }`
      }
    >
      <span className="h-fit">{label}</span>
    </NavLink>
  )
}

export default ComponentNavBar
