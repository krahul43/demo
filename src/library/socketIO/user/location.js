import { socket, socketName } from "..";
/**
 * @description Subscribes to an event that is dispatched when a new travel reservation is registered  near driver location
 * @param {Function} callback Callback for the listener
 */
export const setUserLocation = (location = null) => {
  if (location) socket.emit(socketName("user.setLocation"), location);
};
