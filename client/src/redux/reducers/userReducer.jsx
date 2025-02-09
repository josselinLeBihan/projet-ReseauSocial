import * as types from "../constants/userConstants"

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

export default userReducer
