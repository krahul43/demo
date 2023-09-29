import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Auth } from "aws-amplify";
import { setActiveServiceAction } from "../redux/actions/activeService.action";
import { deleteDriverApiAction } from "../redux/actions/taxista/driverAction";
import { unsubscribeToRooms } from "../socketIO/";
import { unRegisterForPushNotificationsAsync } from "../utils/pushNotification.util";
import { verifyConnection } from "../utils/wifiConnection.util";

//*ESTA FUNCION VERIFICA SI HAY UN USUARIO GUARDADO EN EL AuthReducer Y LO DEVUELVE SI ES ASI
export const useAuthenticatedUser = () => {
  const { user } = useSelector(({ Auth }) => Auth);
  return user;
};

//* FUNCION DE AWS PARA DESLOGUEARSE Y LIMIPIAR EL STORAGE (POOL) DE AWS
export const signOut = async () => {
  try {
    // await Auth.signOut({ global: true });
    setTimeout(() => {
      Promise.resolve();
    }, 300);
  } catch (error) {
    console.error(error);
  }
};

export const useSignOut = () => {
  const { driver } = useSelector(({ driverReducer }) => driverReducer);
  const dispatch = useDispatch();
  const {
    user: { id: user_id },
    token,
  } = driver || {};
  const zone = driver.user?.Zone?.code;
  const cleanActiveService = () => dispatch(setActiveServiceAction(null));
  const deleteDriverApi = () => dispatch(deleteDriverApiAction());
  const SignOut = () =>
    new Promise(async (resolve, reject) => {
      try {
        if (!verifyConnection(true)) return;
        unsubscribeToRooms({ zone, user_id });
        cleanActiveService();
        deleteDriverApi();
        await unRegisterForPushNotificationsAsync(token);
        // await signOut();
        resolve();
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  return SignOut;
};
