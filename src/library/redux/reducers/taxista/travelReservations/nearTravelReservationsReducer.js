//* REDUCER QUE MANEJA LA PETICION A LA API CUANDO SE SOLICITA LA INFORMACION DEL USUARIO, CUANDO SE LLAMA A LA API, CCUANDO LA RESPUESTA DE LA API ES EXITOSA Y CUANDO NO
import {
  SET_TRAVEL_RESERVATIONS,
  ADD_TRAVEL_RESERVATION,
  UPDATE_TRAVEL_RESERVATION,
  REMOVE_TRAVEL_RESERVATION,
  PRE_REMOVE_TRAVEL_RESERVATION,
  SET_TRAVEL_RESERVATIONS_LOADING,
} from "../../../types/taxista/actionTypes";

const initialState = {
  travelReservations: [],
  loading: false,
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_TRAVEL_RESERVATIONS:
      return { ...state, travelReservations: payload };

    case ADD_TRAVEL_RESERVATION:
      if (!state.travelReservations.some((tr) => tr.id == payload.id))
        return {
          ...state,
          travelReservations: [payload, ...state.travelReservations],
        };
      else return state;

    case UPDATE_TRAVEL_RESERVATION:
      return {
        ...state,
        travelReservations: state.travelReservations.map((currentTr) => {
          const { id: cId } = currentTr;
          const { id } = payload;
          if (id == cId) return payload;
          return currentTr;
        }),
      };

    case REMOVE_TRAVEL_RESERVATION:
      return {
        ...state,
        travelReservations: state.travelReservations.filter(
          ({ id }) => id != payload
        ),
      };
    case PRE_REMOVE_TRAVEL_RESERVATION:
      return {
        ...state,
        travelReservations: state.travelReservations.map((currentTr) => {
          const { id } = currentTr;
          if (id == payload) currentTr.preRemove = true;
          return currentTr;
        }),
      };

    case SET_TRAVEL_RESERVATIONS_LOADING:
      return {
        ...state,
        loading: payload,
      };

    default:
      return state;
  }
}
