import { Alert, Platform } from "react-native";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import OverlayPermissionModule from "rn-android-overlay-permission";

const requestLocationPermission = async () => {
  const { status } = await Permissions.askAsync(Permissions.LOCATION);
  return status === "granted" ? true : false;
};

export const getLocationPermissions = async () => {
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

export const getOverlayPermissions = async () => {
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
              onPress: () => OverlayPermissionModule.requestOverlayPermission(),
            },
          ],
          { cancelable: false }
        );
      }
    });
  }
};
