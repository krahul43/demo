import { SET_GPS_STATE } from "../types/index";

const initialState = {
  showGpsAlert: false,
};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_GPS_STATE:
      return { ...state, showGpsAlert: payload };

    default:
      return state;
  }
};
