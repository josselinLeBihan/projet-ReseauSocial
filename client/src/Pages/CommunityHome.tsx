import React from "react"
import { useParams } from "react-router-dom"
import CommunityMainSection from "../Components/Community/CommunityMainSection"
import { CommunityData } from "../redux/api/type"
import { useAppSelector } from "../redux/store"

function CommunityHome() {
  const community: CommunityData = useAppSelector(
    (state) => state.community?.community,
  )

  return (
    <div className="flex flex-col gap-6">
      {community && (
        <>
          <div className="flex rounded-2xl flex-col gap-2 bg-gray-50">
            <img
              src={community?.image}
              className="h-52 object-cover rounded-t-2xl"
            />
            <div className="p-6 pb-0 flex flex-col">
              <div className="flex gap-2">
                <h1 className="text-lg text-gray-900 font-medium">
                  {community?.name}
                </h1>
                <button className="flex bg-teal-600 text-gray-50 hover:bg-teal-700 px-2 py-1 rounded">
                  Suivre
                </button>
              </div>
              <p className="text-gray-500">{`${community?.members?.length} membres`}</p>
            </div>
            <div className="flex">
              <button className="flex justify-center items-center px-6 py-2 border-b-2 border-gray-50 hover:border-teal-600">
                Forum
              </button>
              <button className="flex justify-center items-center px-6 py-2 border-b-2 border-gray-50 hover:border-teal-600">
                A propos
              </button>
              <button className="flex justify-center items-center px-6 py-2 border-b-2 border-gray-50 hover:border-teal-600">
                Membres
              </button>
            </div>
          </div>
          <CommunityMainSection communityId={community?._id} />
        </>
      )}
    </div>
  )
}

export default CommunityHome
