import React, { memo, useMemo } from "react"
import { CommunityData } from "../../redux/api/type"
import { useAppSelector } from "../../redux/store"
import Search from "../shared/Search"

//TODO implémenter la recherche et la réccupération des membres
//const MemoizedMember = memo(member)

function CommunityMembers() {
  const community: CommunityData = useAppSelector(
    (state) => state.community?.community,
  )

  const memberId = community.members

  const communityMember = useMemo(() => {}, [community])

  return (
    <div className="flex flex-col p-6 rounded-2xl gap-4">
      <div className="lex flex-col gap-2">
        <p className="gray-900 text-lg font-medium">Membres</p>
        <Search placeholder="Rechercher un membre" />
      </div>
    </div>
  )
}

export default CommunityMembers
