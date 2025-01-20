const express = require("express");
const router = express.Router();

const {
    getNotMemberCommunities,
    getMemberCommunities,
    getCommunityMembers,
    getCommunity,
    getCommunities,
    joinCommunity,
    leaveCommunity,
} = require("../controllers/communities.controller");

router.get("/notmember", getNotMemberCommunities);
router.get("/member", getMemberCommunities);
router.get("/:name/members", getCommunityMembers);
router.get("/:name", getCommunity);
router.get("/", getCommunities);

router.post("/:name/join", joinCommunity);
router.post("/:name/leave", leaveCommunity);

module.exports = router;