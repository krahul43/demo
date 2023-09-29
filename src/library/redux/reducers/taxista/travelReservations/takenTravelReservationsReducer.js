//* REDUCER QUE MANEJA LA PETICION A LA API CUANDO SE SOLICITA LA INFORMACION DEL USUARIO, CUANDO SE LLAMA A LA API, CCUANDO LA RESPUESTA DE LA API ES EXITOSA Y CUANDO NO
import {
  SET_TAKEN_TRAVEL_RESERVATIONS,
  ADD_TAKEN_TRAVEL_RESERVATIONS,
  SET_TAKEN_TRAVEL_RESERVATIONS_LOADING,
} from "../../../types/taxista/actionTypes";

const initialState = {
  takenTravelReservations: [],
  loading: false,
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_TAKEN_TRAVEL_RESERVATIONS:
      return {
        ...state,
        takenTravelReservations: payload,
      };
    case ADD_TAKEN_TRAVEL_RESERVATIONS:
      return {
        ...state,
        takenTravelReservations: [...state.takenTravelReservations, ...payload],
      };
    case SET_TAKEN_TRAVEL_RESERVATIONS_LOADING:
      return {
        ...state,
        loading: payload,
      };
    default:
      return state;
  }
}
