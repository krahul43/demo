import { SET_MAINTENANCE_STATE } from "../types/index";

export const setMaintenanceState = (showAlert) => ({
  type: SET_MAINTENANCE_STATE,
  payload: showAlert,
});
