//* REDUCER QUE MANEJA LA PETICION A LA API CUANDO SE SOLICITA LA INFORMACION DEL USUARIO, CUANDO SE LLAMA A LA API, CCUANDO LA RESPUESTA DE LA API ES EXITOSA Y CUANDO NO
import {
  SET_PAYMENT,
  SET_PAYMENT_LOADING,
} from "../../types/taxista/actionTypes";

const initialState = {
  data: null,
  loading: false,
};

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case SET_PAYMENT:
      return { ...state, data: payload };
    case SET_PAYMENT_LOADING:
      return { ...state, loading: payload };
    default:
      return state;
  }
}
