//* AQUI SE COMBINAN TODOS LOS REDUCER Y SE PASAN DESPUES AL STORAGE EN APP.JS
import { combineReducers } from "redux";

import Auth from "./Auth.reducer";
import userLocationReducer from "./userLocation.reducer";
import activeServiceReducer from "./activeService.reducer";
import driverReducer from "./taxista/driverReducer";
import nearTravelReservationsReducer from "./taxista/travelReservations/nearTravelReservationsReducer";
import takenTravelReservationsReducer from "./taxista/travelReservations/takenTravelReservationsReducer";
import activePaymentReducer from "./taxista/activePaymentReducer";

import porterActiveServicesReducer from "./porter/porterActiveServicesReducer";

import internetReducer from "./internetReducer";
import gpsReducer from "./gpsReducer";
import maintenanceReducer from './maintenanceReducer'

const rootReducer = combineReducers({
  Auth,
  userLocationReducer,
  driverReducer,
  nearTravelReservationsReducer,
  takenTravelReservationsReducer,
  activeServiceReducer,
  internetReducer,
  gpsReducer,
  activePaymentReducer,
  porterActiveServicesReducer,
  maintenanceReducer
});

export default rootReducer;
