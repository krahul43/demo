import { useEffect } from "react";
import { Alert } from "react-native";
import NetInfo from "@react-native-community/netinfo";

/**
 * @function
 * @description Verifies internet connection
 */
export const verifyConnection = async (alert = true) => {
  const state = await NetInfo.fetch();
  if (state.isConnected === false) {
    if (alert) {
      Alert.alert(
        "No tienes conexión a internet",
        "Por favor verifica tu conexión a internet"
      );
      return false;
    } else return false;
  }

  return state.isConnected;
};

export const useSubscribeToNetInfoChange = (callback) => {
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(callback);
    return () => unsubscribe();
  }, []);
};
