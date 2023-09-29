import { useEffect, useState } from "react";
import { AppState } from "react-native";
import { useSelector } from "react-redux";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import { apiCall } from "../networking/API";
import PushNotification from "react-native-push-notification";
import AsyncStorage from "@react-native-community/async-storage";
import { getAppData } from "../../../TasksRegistry";

export const configurePushNotifications = () => {
  PushNotification.configure({
    onRegister: async ({ token, os }) => {
      await AsyncStorage.setItem("taxizone:pt", JSON.stringify({ token, os }));
    },
    onNotification: async ({ title }) => {
      const data = await getAppData();
      const { store } = data || {};
      let { driverReducer } = store;
      driverReducer = JSON.parse(driverReducer);

      if (driverReducer?.driver?.user?.type != "driver") {
        console.log("notification for ", driverReducer?.driver?.user?.type);
        if (AppState.currentState == "active")
          PushNotification.localNotification({
            channelId: "fcm_fallback_notification_channel",
            message: title,
            allowWhileIdle: true,
            color: "#F2B215",
            soundName: "taxi.png",
            playSound: true,
          });
      }
    },
  });

  PushNotification.createChannel(
    {
      channelId: "fcm_fallback_notification_channel", // (required)
      channelName: "default", // (required)
      channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
      importance: 4, // (optional) default: 4. Int value of the Android notification importance
      vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
      soundName: "taxi.png",
      playSound: true,
    },
    (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
  );
};

// +57 3226145446

/**
 * @description Asks expo for a push notification token and saves it in the database for user to receive notifications
 * @param {String} access_token JWT token brought by the get user info api call
 */
export const useRegisterForPushNotificationsAsync = () => {
  const [userPushToken, setUserPushToken] = useState(null);
  const {
    driverReducer: { driver },
  } = useSelector(({ driverReducer }) => ({ driverReducer }));
  const { token: access_token, user } = driver;
  const { push_token } = user || {};

  const saveUserToken = async (access_token, userPushToken) =>
    await updateUserToken(access_token, userPushToken);

  const registerForPushNotificationsAsync = () =>
    new Promise(async (resolve, reject) => {
      try {
        const deviceToken = await AsyncStorage.getItem("taxizone:pt");
        if (Constants.isDevice) {
          // Asks for existing permission
          const { status: existingStatus } = await Permissions.getAsync(
            Permissions.NOTIFICATIONS
          );

          let finalStatus = existingStatus;

          // If permission is not granted, asks for the permission again
          if (existingStatus !== "granted") {
            const { status } = await Permissions.askAsync(
              Permissions.NOTIFICATIONS
            );
            finalStatus = status;
          }

          // If definitely the user did not grant the permission, returns
          if (finalStatus !== "granted") {
            return () => {};
          }

          await updateUserToken(access_token, deviceToken);
          resolve(() => {});
        } else resolve(() => {});
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });

  useEffect(() => {
    if (push_token != userPushToken) {
      setUserPushToken(push_token);
    }
  }, [push_token]);

  useEffect(() => {
    if (userPushToken) {
      saveUserToken(access_token, userPushToken);
    }
  }, [userPushToken]);

  return registerForPushNotificationsAsync;
};

export const unRegisterForPushNotificationsAsync = (access_token) =>
  new Promise(async (resolve, reject) => {
    try {
      const res = await updateUserToken(access_token);
      resolve(res);
    } catch (error) {
      reject(error);
    }
  });

/**
 * @param {String} access_token JWT token
 * @param {String} push_token  Expo push notification token to send
 */
const updateUserToken = (access_token, push_token = "unregistered") =>
  apiCall(
    `/auth/user/pt/${push_token}`,
    null,
    {
      "taxi-zone-access-token": access_token,
    },
    "PUT"
  );
