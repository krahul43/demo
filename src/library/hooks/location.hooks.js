import { useState, useEffect } from "react";
import { dev } from "../../../env";
import * as Location from "expo-location";
import { setUserLocation } from "../socketIO/user/location";
import getDistance from "geolib/es/getDistance";
import { useDispatch, useSelector } from "react-redux";
import { setUserLocationAction } from "../redux/actions/userLocation.action";
import { getDirectionFromGeoReverse } from "../utils/mapUtils";

export const useCurrentLocationRegister = () => {
  const { driver } = useSelector(({ driverReducer }) => driverReducer);
  const isDriver = driver?.user?.type == "driver";
  const user_id = driver?.user?.id;
  const dispatch = useDispatch();
  const setUserLocationInStore = (location) =>
    dispatch(setUserLocationAction(location));

  const askForCurrentPosition = () => {
    return new Promise((resolve, reject) =>
      getCurrentPosition()
        .then(async (newLocation) => {
          if (!newLocation) resolve();
          const [geoPosition] = await Location.reverseGeocodeAsync(newLocation);
          const address = getDirectionFromGeoReverse(geoPosition);
          setUserLocationInStore({ coords: newLocation, address, user_id });
          if (isDriver) {
            setUserLocation({ ...newLocation, user_id });
          }
          resolve({ coords: newLocation, address });
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        })
    );
  };

  return askForCurrentPosition;
};

export const distance = (c1, c2) => getDistance(c1, c2);
export const getCurrentPosition = () =>
  new Promise((resolve, reject) =>
    Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    })
      .then(({ coords: { longitude, latitude } }) => {
        resolve({ longitude, latitude });
      })
      .catch((error) => reject(error))
  );

export const getLocationPermission = async () =>
  (await Location.getPermissionsAsync()).status === "granted";
