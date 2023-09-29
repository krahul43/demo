//* ACCCION QUE SETEA EL USUARIO AWS Y LO GUARDA EN EL REDUCER
import { SET_ACTIVE_SERVICE } from "../types/index";

export const setActiveServiceAction = (service) => ({
  type: SET_ACTIVE_SERVICE,
  payload: service,
});
