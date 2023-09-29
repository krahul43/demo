//* REDUCER QUE MANEJA LA PETICION A LA API CUANDO SE SOLICITA LA INFORMACION DEL USUARIO, CUANDO SE LLAMA A LA API, CCUANDO LA RESPUESTA DE LA API ES EXITOSA Y CUANDO NO
import { SET_ACTIVE_SERVICE } from "../types";

const initialState = null;

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_ACTIVE_SERVICE:
      return payload;

    default:
      return state;
  }
};
