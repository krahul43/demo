//*ACCIONES PARA SETEAR Y BORRAR EL USUARIO QUE DEVUELVE LA API
import {
  SET_PAYMENT,
  SET_PAYMENT_LOADING,
} from "../../types/taxista/actionTypes";

export const setPaymentAction = (activeService) => {
  return {
    type: SET_PAYMENT,
    payload: activeService,
  };
};

export const setPaymentLoadingAction = (loading) => {
  return {
    type: SET_PAYMENT_LOADING,
    payload: loading,
  };
};
