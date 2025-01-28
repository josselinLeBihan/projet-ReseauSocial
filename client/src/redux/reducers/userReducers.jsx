import * as types from "../constants/authConstants"

const initialState = {
  user: {},
  publicUsers: [],
  publicUserProfile: {},
  followingUsers: [],
  isFollowing: null,
  userError: null,
}

const userReducer = (state = initialState, action) => {
  const { type, payload } = action
  switch (type) {
    default:
      return state
  }
}
