//* REDUCER QUE MANEJA LA PETICION A LA API CUANDO SE SOLICITA LA INFORMACION DEL USUARIO, CUANDO SE LLAMA A LA API, CCUANDO LA RESPUESTA DE LA API ES EXITOSA Y CUANDO NO
import {
  SET_ACTIVE_SERVICES,
  ADD_ACTIVE_SERVICE,
  UPDATE_ACTIVE_SERVICE,
  REMOVE_ACTIVE_SERVICE,
} from "../../types/porter/actionTypes";

const initialState = {
  data: [],
  loading: false,
};

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case SET_ACTIVE_SERVICES:
      return { ...state, data: payload };
    case ADD_ACTIVE_SERVICE:
      return { ...state, data: [...state.data, payload] };
    case UPDATE_ACTIVE_SERVICE:
      return {
        ...state,
        data: state.data.map((service) => {
          if (service.id == payload.id) return payload;
          else return service;
        }),
      };
    case REMOVE_ACTIVE_SERVICE:
      return {
        ...state,
        data: state.data.filter((service) => service.id != payload),
      };
    default:
      return state;
  }
}
