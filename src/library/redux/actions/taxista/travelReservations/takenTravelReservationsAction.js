//*ACCIONES PARA SETEAR Y BORRAR EL USUARIO QUE DEVUELVE LA API
import {
  SET_TAKEN_TRAVEL_RESERVATIONS,
  ADD_TAKEN_TRAVEL_RESERVATIONS,
  SET_TAKEN_TRAVEL_RESERVATIONS_LOADING,
} from "../../../types/taxista/actionTypes";

export const setTakenTravelReservationsAction = (takenTravelReservations) => {
  return {
    type: SET_TAKEN_TRAVEL_RESERVATIONS,
    payload: takenTravelReservations,
  };
};

export const addTakenTravelReservationsAction = (takenTravelReservations) => {
  return {
    type: ADD_TAKEN_TRAVEL_RESERVATIONS,
    payload: takenTravelReservations,
  };
};

export const setTakenTravelReservationsLoadingAction = (loading) => {
  return {
    type: SET_TAKEN_TRAVEL_RESERVATIONS_LOADING,
    payload: loading,
  };
};
