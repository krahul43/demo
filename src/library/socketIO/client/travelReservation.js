import { socket, socketName, registerSocketDisconnetCallback } from "..";

export const subscribeClientToTakenActiveTravelReservationEvent = (callback) => {
  const callBack = () =>
    socket.on(socketName("client.travelReservationTaken"), callback);
  callBack();
  registerSocketDisconnetCallback(callBack);
  return () => {
    socket.off(socketName("client.travelReservationTaken"), callback);
  };
};


export const subscribeClientToTravelReservationDriverAtPlaceEvent = (callback) => {
  const callBack = () =>
    socket.on(socketName("client.travelReservationDriverAtPlace"), callback);
  callBack();
  registerSocketDisconnetCallback(callBack);
  return () => {
    socket.off(socketName("client.travelReservationDriverAtPlace"), callback);
  };
};

export const subscribeClientToTavelReservationFinished = (callback) => {
  const callBack = () =>
    socket.on(socketName("client.travelReservationFinished"), callback);
  callBack();
  registerSocketDisconnetCallback(callBack);
  return () => {
    socket.off(socketName("client.travelReservationFinished"), callback);
  };
};

export const subscribeClientToTavelReservationCanceled = (callback) => {
  const callBack = () =>
    socket.on(socketName("client.travelReservationCanceled"), callback);
  callBack();
  registerSocketDisconnetCallback(callBack);
  return () => {
    socket.off(socketName("client.travelReservationCanceled"), callback);
  };
};

export const subscribeClientToTavelReservationETA = (callback) => {
  const callBack = () =>
    socket.on(socketName("client.travelReservationETA"), callback);
  callBack();
  registerSocketDisconnetCallback(callBack);
  return () => {
    socket.off(socketName("client.travelReservationETA"), callback);
  };
};