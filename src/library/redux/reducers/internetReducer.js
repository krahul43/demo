import { SET_INTERNET_STATE } from "../types/index";

const initialState = {
  showInternetAlert: false
};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_INTERNET_STATE:
      return {...state, showInternetAlert : payload};

    default:
      return state;
  }
};
