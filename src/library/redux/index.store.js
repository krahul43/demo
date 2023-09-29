//* CREAMOS EL STORAGE Y DEFINIMOS QUE TENDRA UN MIDDLEWARE (SAGAS)
import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import AsyncStorage from "@react-native-community/async-storage";
import { persistStore, persistReducer } from "redux-persist";

import rootReducer from "./reducers/";
import rootSaga from "../networking/sagas/";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: [
    "driverReducer",
    "activeServiceReducer",
    "activePaymentReducer",
    "porterActiveServicesReducer",
    "userLocationReducer",
  ],
  debounce: 500,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

//* CREAMOS EL STORAGE Y DEFINIMOS QUE TENDRA UN MIDDLEWARE (SAGAS)

//* CREAMOS EL OBJETO SAGAS
const sagaMiddleware = createSagaMiddleware();

//* LE PASAMOS LOS REDUCER AL STORAGE Y APLICAMOS EL SAGAS COMO MIDDLEWARE
export const store = createStore(
  persistedReducer,
  applyMiddleware(sagaMiddleware)
);

//* CON ESTA FUNCION EL MIDDLEWARE EMPIEZA A ESCUCHAR
sagaMiddleware.run(rootSaga);

export const persistor = persistStore(store);
