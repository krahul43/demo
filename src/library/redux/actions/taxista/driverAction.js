//*ACCIONES PARA SETEAR Y BORRAR EL USUARIO QUE DEVUELVE LA API
import { GET_DRIVER_API, DELETE_DRIVER_API, SET_DRIVER_API, UPDATE_DRIVER_USER } from '../../types/taxista/actionTypes';

export const getDriverApiAction = aws_token => {
  return {
    type: GET_DRIVER_API,
    aws_token
  }
}

export const setDriverApiAction = payload => {
  return{
    type: SET_DRIVER_API,
    payload
  }
}

export const deleteDriverApiAction = () => {
  return {
    type: DELETE_DRIVER_API
  }
}

export const updateDriverUserAction = payload => {
  return{
    type: UPDATE_DRIVER_USER,
    payload
  }
}