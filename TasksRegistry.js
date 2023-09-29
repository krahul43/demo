/**
 *  Aqui consultamos por servicios nuevos cada 15 segundos, si hay abrimos la app
 *
 *  Como vamos a saber si hay un servicio nuevo?
 *  Vamos a guardar en el AsyncStorage si el taxista esta disponible o no.
 *  Vamos a guardar en el AsyncStorage los ids de servicios cerca cargados
 *  en BACKGROUND
 *  - vamos a consultar si el usuario esta disponible, si es asi.....
 *    - vamos a consultar los ids de los servicios cerca mediante un endpoint
 *    - vamos a comparar los servicios carca nuevos con los previamente guardados
 *      - eliminamos del store los que ya no esten disponibles
 *      - si hay servicios disponibles nuevos, los agregamos al store e invocamos el app
 *
 *
 * easy
 */
import { useState } from "react";
import { AppState } from "react-native";
import * as Speech from "expo-speech";
import BackgroundTimer from "react-native-background-timer";
import AsyncStorage from "@react-native-community/async-storage";

import { verifyConnection } from "./src/library/utils/wifiConnection.util";
import { getTravelsId } from "./src/library/hooks/request/drivers/travelReservation/useLoadNearTravelReservations.hooks";
import { distance } from "./src/library/hooks/location.hooks";
import PushNotification from "react-native-push-notification";
import SoundPlayer from "react-native-sound-player";
import { counterLimit } from "./env";
import {
  socket,
  openConnection,
  closeConnection,
  subscribeDriverToNewNearTravelReservationEvent,
  unSubscribeDriverToNewNearTravelReservationEvent,
  subscribeToChannel,
  subscribeToZone,
} from "./src/library/socketIO/";
import NetInfo from "@react-native-community/netinfo";
// functions to set and get near services id from AsyncStorage

// procesar los servicios cerca
const processServices = async () => {
  try {
    let updateLocationCounter = 0;

    const listenForNewServices = async () => {
      const appState = AppState.currentState;
      if (!(await verifyConnection(false)) || appState == "active")
        return false;
      console.log("listen");
      const data = await getAppData();
      const { store } = data || {};
      if (!store) return false;
      let { driverReducer, userLocationReducer } = store;
      driverReducer = JSON.parse(driverReducer);
      userLocationReducer = JSON.parse(userLocationReducer);
      if (driverReducer?.driver?.user?.type != "driver") return false;
      const {
        driver: { user },
      } = driverReducer;
      const { available } = user;
      if (!available) return false;

      connectSocket(data, (tr) => {
        if (AppState.currentState == "active") return;
        console.log("socket service");
        const { client_address } = tr;
        Speech.speak(`Nuevo servicio en ${client_address}`);
        // updateLocationCounter = 0;
        invokeApp();
      });

      // console.log({ updateLocationCounter });
      // if (updateLocationCounter >= counterLimit) {
      //    updateLocationCounter = 0;
      //    invokeApp(false);
      // } else updateLocationCounter = updateLocationCounter + 1;
    };

    let intervalId;
    const startIntervalId = () => {
      listenForNewServices();
      if (intervalId) BackgroundTimer.clearInterval(intervalId);
      intervalId = BackgroundTimer.setInterval(
        () => listenForNewServices(),
        8000
      );
    };
    startIntervalId();
    socket.on("connect", () => {
      console.log("bg connect");
      startIntervalId();
    });

    // console.log({ updateLocationCounter });
    // if (updateLocationCounter >= counterLimit) {
    //   updateLocationCounter = 0;
    //   invokeApp(false);
    // } else updateLocationCounter = updateLocationCounter + 1;
  } catch (error) {
    console.error(error);
  }
};

const invokeApp = (sound = true) => {
  PushNotification.invokeApp({
    channelId: "fcm_fallback_notification_channel",
    message: "",
    allowWhileIdle: true,
    color: "#F2B215",
    playSound: false,
  });

  if (sound) SoundPlayer.playSoundFile("taxi", "mp3");
};

export const getAppData = () =>
  new Promise((resolve, reject) => {
    const dmemory = {};
    AsyncStorage.getAllKeys((errKeys, keys) => {
      if (errKeys) return reject(errKeys);
      AsyncStorage.multiGet(keys, (err, stores) => {
        if (err) return reject(err);
        stores?.map((result, index, store) => {
          const key = store[index][0];
          const value = store[index][1];
          dmemory[key] = value;
        });
        resolve({
          store: JSON.parse(dmemory["persist:root"]),
          locationCounter: dmemory.LocationCounter,
          services: dmemory.NearServices
            ? JSON.parse(dmemory.NearServices)
            : [],
        });
      });
    });
  });

const connectSocket = (data, serviceNearCallback) => {
  const { store } = data || {};
  if (!store) return false;
  let { driverReducer } = store;
  driverReducer = JSON.parse(driverReducer);

  const subscribeToChannels = () => {
    const {
      driver: { user, token },
    } = driverReducer;
    const {
      id,
      Zone: { code: zone_code },
    } = user;
    subscribeToChannel(id);
    subscribeToZone(zone_code);
  };
  const open = () => {
    unSubscribeDriverToNewNearTravelReservationEvent();
    openConnection();
    subscribeToChannels();
    subscribeDriverToNewNearTravelReservationEvent(serviceNearCallback);
  };

  open();

  socket.on("connect", () => open());

  AppState.addEventListener("change", (state) => {
    if (state == "background") openConnection();
  });

  socket.on("disconnect", () => {
    setTimeout(() => openConnection(), 1000);
  });
};

export const useBackgroundTimer = () => {
  const innitTimer = () => {
    return initBackgroundTimer();
  };

  const stopTimer = (intervalID) => {
    console.log("stop", intervalID);
    stopBackgroundTimer(intervalID);
  };

  return { innitTimer, stopTimer };
};

// inicializar timer
const initBackgroundTimer = () => {
  let intervalId = BackgroundTimer.setTimeout(() => processServices(), 1000);
  return intervalId;
};

const stopBackgroundTimer = (intervalId) => {
  console.log("stop ", intervalId);
  BackgroundTimer.clearTimeout(intervalId);
};

// const processServices = async () => {
//   try {
//     const appState = AppState.currentState;
//     if (!(await verifyConnection(false)) || appState == "active") return false;
//     const data = await getAppData();
//     const { store, services, locationCounter = 0 } = data || {};
//     if (!store) return false;
//     let { driverReducer, userLocationReducer } = store;
//     driverReducer = JSON.parse(driverReducer);
//     userLocationReducer = JSON.parse(userLocationReducer);
//     if (driverReducer?.driver?.user?.type != "driver") return false;
//     const {
//       driver: { user, token },
//     } = driverReducer;
//     const {
//       available,
//       Zone: { code: zone_code },
//     } = user;
//     if (!available) return false;
//     const newServices = await getTravelsId({
//       token,
//       userLocation: userLocationReducer.coords,
//       zone_code,
//     });
//     const servicesWithOutRemoved = services.filter((serviceId) => {
//       let flag = false;
//       newServices.map((newServiceId) => {
//         if (newServiceId == serviceId) flag = true;
//       });
//       return flag;
//     });
//     const newServicesExtracted = newServices.filter((newServiceId) => {
//       let flag = true;
//       servicesWithOutRemoved.map((serviceId) => {
//         if (newServiceId == serviceId) flag = false;
//       });
//       return flag;
//     });
//     setNearServicesToAsyncStorage([
//       ...servicesWithOutRemoved,
//       ...newServicesExtracted,
//     ]);

//     console.log({ newServicesExtracted });

//     setNewNearServicesToAsyncStorage(newServicesExtracted);

//     // if there are new Services, call the app
//     if (newServicesExtracted.length) {
//       invokeApp();
//     } else {
//       const counter = Number(locationCounter) + 1;
//       setLocationCounterToAsyncStorage(counter);
//       console.log({ counter });
//       if (counter >= counterLimit) {
//         invokeApp(false);
//       }
//     }
//   } catch (error) {
//     console.error(error);
//   }
// };
