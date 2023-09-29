//*REDUCER QUE ACTUALIZA EL ESTADO EL USUARIO DE AWS SEGUN EL TIPO DE ACCION 
import { SET_USER_AWS } from "../types/index";

const initialState = {
  aws_user: null,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_USER_AWS:
      return { ...state, aws_user: payload };
    default:
      return state;
  }
};
