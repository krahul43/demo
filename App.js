//   "expo-constants": "~9.3.3",
import React, { useEffect } from "react";
import { Alert, Platform } from "react-native";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { configurePushNotifications } from "./src/library/utils/pushNotification.util";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import OverlayPermissionModule from "rn-android-overlay-permission";
import Navigator from "./src/views/Navigator/index";
import "./LogBox";
import "./configureAmplify";
import { store, persistor } from "./src/library/redux/index.store";

//* TEMA DE LA APLICACION
export const theme = {
  ...DefaultTheme,
  roundness: 50,
  colors: {
    ...DefaultTheme.colors,
    primary: "#F2B215",
    darkBrand: "#000",
    success: "#2E86C1",
    red: "#CB4335",
    black: "#000",
  },
};
configurePushNotifications();
export default function App() {
  const requestLocationPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    return status === "granted" ? true : false;
  };

  const getLocationPermissions = async () => {
    const { status } = await Location.getPermissionsAsync();
    if (Platform.OS !== "ios") {
      if (status !== "granted") {
        Alert.alert(
          "Permiso de ubicación",
          "Solicitamos tu ubicación para encontrar taxis o servicios a tu alrededor, calcular tarifas y trayectoria de tu destino. La ubicación no se usa en ningun momento para fines publicitarios",
          [
            {
              text: "Continuar",
              onPress: () => requestLocationPermission(),
            },
          ]
        );
      }
    } else {
      requestLocationPermission();
    }
  };

  const getOverlayPermissions = async () => {
    if (Platform.OS === "android") {
      OverlayPermissionModule.isRequestOverlayPermissionGranted((status) => {
        if (status) {
          Alert.alert(
            "Permiso para sobreponer aplicación en primer plano",
            "Se requiere que la aplicación pueda sobreponerse sobre otras apps para que esta se abra en el caso de estar en segundo plano y se notifique un servicio cercano para facilitar la toma de servicios",
            [
              {
                text: "Cancelar",
                onPress: () => console.log("Cancelado"),
                style: "cancel",
              },
              {
                text: "Permitir",
                onPress: () =>
                  OverlayPermissionModule.requestOverlayPermission(),
              },
            ],
            { cancelable: false }
          );
        }
      });
    }
  };

  useEffect(() => {
    // getLocationPermissions();
    // getOverlayPermissions();
  }, []);

  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PaperProvider theme={theme}>
          <SafeAreaProvider>
            <Navigator />
          </SafeAreaProvider>
        </PaperProvider>
      </PersistGate>
    </ReduxProvider>
  );
}
