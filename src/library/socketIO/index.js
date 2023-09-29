import io from "socket.io-client";
import { BASE_URL, ENV } from "../../../env";
import { verifyConnection } from "../utils/wifiConnection.util";

export const socket = io.connect(BASE_URL);
/**
 * @function
 * @description Subscription to a private WebSocket for the user to receive real time data from the server
 * @param {Number} user_id Logged in user´s id
 */

const tryReconnect = () => {
  setTimeout(() => {
    socket.io.open((err) => {
      if (err) {
        socket.io.connect();
        tryReconnect();
      }
    });
  }, 2000);
};

socket.io.on("close", tryReconnect);

export const openConnection = () => {
  socket.io.connect();
  socket.open();
};

export const closeConnection = () => {
  socket.close();
};

export const subscribeToChannel = (user_id) => {
  if (!verifyConnection()) return;
  const callBack = () => socket.emit(socketName("room"), user_id);
  callBack();
  registerSocketDisconnetCallback(callBack);
};

export const subscribeToZone = (zone) => {
  if (!verifyConnection()) return;
  const callBack = () => socket.emit(socketName("zone"), zone);
  callBack();
  registerSocketDisconnetCallback(callBack);
};

export const unsubscribeToRooms = ({ zone, user_id }) => {
  if (!verifyConnection()) return;
  socket.off("disconnect");
  socket.emit(socketName("unsubscribe"), { zone, user_id });
  socket.close();
};

export const socketName = (name) => `${ENV}-${name}`;

export const registerSocketDisconnetCallback = (callback) =>
  socket.on("disconnect", function () {
    socket.connect(callback);
  });

/**
 *
 * @param {Function} callback funcion que se ejecuta cuando llega una nueva reservación de viaje
 */
export const subscribeDriverToNewNearTravelReservationEvent = (callback) => {
  const callBack = () =>
    socket.on(socketName("driver.newNearTravelReservation"), callback);
  callBack();
  registerSocketDisconnetCallback(callBack);
  return () =>
    socket.off(socketName("driver.newNearTravelReservation"), callback);
};

export const unSubscribeDriverToNewNearTravelReservationEvent = () => {
  socket.off(socketName("driver.newNearTravelReservation"));
};

export default socket;
