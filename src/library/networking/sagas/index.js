//* AQUI SE UNEN TODOS LOS SAGAS (MIDDLEWARE) Y SE LE PASAN AL STORAGE DE REDUX 
import { all } from 'redux-saga/effects';

import { watchGetDriver } from "./taxista/driverSaga"

export default function* rootSaga() {
  yield all([
    watchGetDriver(),
  ]) 
}