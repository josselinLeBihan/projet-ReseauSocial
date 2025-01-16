import React from "react"
import PeopleAltIcon from "@mui/icons-material/PeopleAlt"
import placeholder from "../../Assets/placeholder.png"

function RightBar() {
  return (
    <div className="flex flex-col h-full w-72 gap-4 p-4 pt-0">
      <div className="flex flex-col ">
        <h3 className="text-lg font-semibold">Travel</h3>
        <div className="flex flex-row gap-2 items-center">
          <PeopleAltIcon
            className="text-teal-600"
            style={{ fontSize: "16px" }}
          />
          <p className="text-sm text-teal-600">2 members</p>
        </div>
      </div>
      <img src={placeholder} alt="comunity image" className="w-full h-56" />
      <span className="">
        Praesent vestibulum ut orci eget maximus. Nullam condimentum vestibulum
        facilisis. Suspendisse nec est nec ligula accumsan venenatis sed eu
        nisi. Nullam tincidunt euismod dolor id vulputate. Duis et magna mauris.
        Aenean placerat a nibh sed lobortis. Vestibulum sodales magna at ipsum
        placerat vestibulum.
      </span>
    </div>
  )
}

export default RightBar
