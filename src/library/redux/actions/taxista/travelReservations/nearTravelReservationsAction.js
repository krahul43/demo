//*ACCIONES PARA SETEAR Y BORRAR EL USUARIO QUE DEVUELVE LA API
import {
  SET_TRAVEL_RESERVATIONS,
  ADD_TRAVEL_RESERVATION,
  UPDATE_TRAVEL_RESERVATION,
  REMOVE_TRAVEL_RESERVATION,
  PRE_REMOVE_TRAVEL_RESERVATION,
  SET_TRAVEL_RESERVATIONS_LOADING,
} from "../../../types/taxista/actionTypes";

export const setTravelReservationsAction = (travelReservations) => {
  return {
    type: SET_TRAVEL_RESERVATIONS,
    payload: travelReservations,
  };
};

export const addTravelReservationAction = (travelReservation) => {
  return {
    type: ADD_TRAVEL_RESERVATION,
    payload: travelReservation,
  };
};

export const updateTravelReservationAction = (travelReservation) => {
  return {
    type: UPDATE_TRAVEL_RESERVATION,
    payload: travelReservation,
  };
};

export const removeTravelReservationAction = (travelReservationId) => {
  return {
    type: REMOVE_TRAVEL_RESERVATION,
    payload: travelReservationId,
  };
};

export const preRemoveTravelReservationAction = (travelReservationId) => {
  return {
    type: PRE_REMOVE_TRAVEL_RESERVATION,
    payload: travelReservationId,
  };
};

export const setTravelReservationsLoadingAction = (loading) => {
  return {
    type: SET_TRAVEL_RESERVATIONS_LOADING,
    payload: loading,
  };
};
