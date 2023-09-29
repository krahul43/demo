//* ACCCION QUE SETEA EL USUARIO AWS Y LO GUARDA EN EL REDUCER
import { SET_USER_LOCATION } from "../types/index";

export const setUserLocationAction = (location) => ({
  type: SET_USER_LOCATION,
  payload: location,
});
