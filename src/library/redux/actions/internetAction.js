import { SET_INTERNET_STATE } from "../types/index";

export const setInternetState = (showAlert) => ({
  type: SET_INTERNET_STATE,
  payload: !showAlert,
});
