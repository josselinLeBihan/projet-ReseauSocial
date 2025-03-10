const express = require("express")
const router = express.Router()

const {
  getNotMemberCommunities,
  getMemberCommunities,
  getCommunityMembers,
  getCommunity,
  getCommunities,
  joinCommunity,
  leaveCommunity,
} = require("../controllers/communities.controller")

router.get("/notmember/:userId", getNotMemberCommunities)
router.get("/member/:userId", getMemberCommunities)
router.get("/:name/members", getCommunityMembers)
router.get("/communities", getCommunities)
router.get("/:name", getCommunity)

router.post("/:communityId/join", joinCommunity)
router.post("/:communityId/leave", leaveCommunity)

module.exports = router
