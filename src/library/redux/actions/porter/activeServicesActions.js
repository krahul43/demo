//*ACCIONES PARA SETEAR Y BORRAR EL USUARIO QUE DEVUELVE LA API
import {
  SET_ACTIVE_SERVICES,
  ADD_ACTIVE_SERVICE,
  UPDATE_ACTIVE_SERVICE,
  REMOVE_ACTIVE_SERVICE,
} from "../../types/porter/actionTypes";

export const setActiveServicesAction = (activeServices) => {
  return {
    type: SET_ACTIVE_SERVICES,
    payload: activeServices,
  };
};

export const addActiveServiceAction = (activeService) => {
  return {
    type: ADD_ACTIVE_SERVICE,
    payload: activeService,
  };
};

export const updateActiveServiceAction = (activeService) => {
  return {
    type: UPDATE_ACTIVE_SERVICE,
    payload: activeService,
  };
};

export const removeActiveServiceAction = (activeServiceId) => {
  return {
    type: REMOVE_ACTIVE_SERVICE,
    payload: activeServiceId,
  };
};
