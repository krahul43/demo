import { socket, socketName, registerSocketDisconnetCallback } from "../";

/**
 * @description Subscribes to an event that is dispatched when a new travel reservation is registered  near driver location
 * @param {Function} callback Callback for the listener
 */
export const subscribeDriverToNewNearTravelReservationEvent = (callback) => {
  const callBack = () =>
    socket.on(socketName("driver.newNearTravelReservation"), callback);
  callBack();
  registerSocketDisconnetCallback(callBack);
  return () => {
    socket.off(socketName("driver.newNearTravelReservation"), callback);
  };
};

export const subscribeDriverToRemoveNearTravelReservationEvent = (callback) => {
  const callBack = () =>
    socket.on(socketName("driver.removeNearTravelReservation"), callback);
  callBack();
  registerSocketDisconnetCallback(callBack);
  return () => {
    socket.off(socketName("driver.removeNearTravelReservation"), callback);
  };
};
