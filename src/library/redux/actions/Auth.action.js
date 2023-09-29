//* ACCCION QUE SETEA EL USUARIO AWS Y LO GUARDA EN EL REDUCER
import { SET_USER_AWS } from "../types/index";

export const setUserAWS = (user) => ({
  type: SET_USER_AWS,
  payload: user,
});
