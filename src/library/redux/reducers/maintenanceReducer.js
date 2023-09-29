import { SET_MAINTENANCE_STATE } from "../types/index";

const initialState = {
  showMaintenanceAlert: false
};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_MAINTENANCE_STATE:
      return {...state, showMaintenanceAlert : payload};

    default:
      return state;
  }
};
