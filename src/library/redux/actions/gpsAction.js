import { SET_GPS_STATE } from "../types/index";

export const setGpsState = (showAlert) => ({
  type: SET_GPS_STATE,
  payload: !showAlert,
});
