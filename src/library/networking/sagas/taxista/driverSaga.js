//* SAGAS QUE MANEJA LAS PETICIONES Y RESPUESTAS DE LA API AL HACER EL REQUEST PARA TRAER EL USUARIO CON EL AWS_TOKEN (NO USADA POR AHORA)
import { put, call, takeLatest } from 'redux-saga/effects';

import { 
    GET_DRIVER_API,
    GET_DRIVER_API_SUCCEEDED,
    GET_DRIVER_API_FAILED
} from '../../../redux/types/taxista/actionTypes';

import { apiCall } from '../../API';


function* getDriver({aws_token}) {
  try {
    //* SE HACE LA PETICION
    const response = yield call(apiCall, 
      '/auth/user', 
      null,
     {'aws_cognito_token':aws_token},
    'GET'
    );
    const payload = yield response.data
    //* SI ES EXITOSA SE DISPARA UNA ACCION DE EXITO EN EL REDUCER SI NO, UNA ACCION DE ERROR
    yield put({type: GET_DRIVER_API_SUCCEEDED, payload});
  } catch (error) {             
    yield put({type: GET_DRIVER_API_FAILED, error});
  }
}

//* FUNCION QUE ESCUCHA CUANDO SE LLAMA A LA ACCION QUE DEVUELVE EL TIPO GET_DRIVER_API Y LA PASA POR EL FILTRO getUser
export function* watchGetDriver() {
    yield takeLatest(GET_DRIVER_API, getDriver);
}