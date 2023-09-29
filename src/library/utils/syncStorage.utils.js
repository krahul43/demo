import AsyncStorage from "@react-native-community/async-storage";

export const setNearServicesToAsyncStorage = async (services = []) =>
  await AsyncStorage.setItem("NearServices", JSON.stringify(services));

export const setNewNearServicesToAsyncStorage = async (services = []) =>
  await AsyncStorage.setItem("NewNearServices", JSON.stringify(services));

export const setLocationCounterToAsyncStorage = async (counter = 1) =>
  await AsyncStorage.setItem("LocationCounter", `${counter}`);

export const getNewNearServicesFromAsyncStorage = async () => {
  const newNearServices = await AsyncStorage.getItem("NewNearServices");
  return JSON.parse(newNearServices || "[]");
};
