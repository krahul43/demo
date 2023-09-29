import * as Location from "expo-location";
import * as Linking from "expo-linking";
import { Platform } from "react-native";
//* POSIBLES TIPOS DE COMO PUEDAN VENIR LAS VARIABLES DE LATITUD Y LONGITUD EN LA LIBRERIA DE MAPAS
const types = ["latitude", "longitude", "lat", "lng"];

//* ESTO CONVIERTE UN OBJETO DE UBICACION EN UNO QUE DEVUELVE SOLO LATITUD Y LONGITUD
export const getLatLng = (location) => {
  if ("latitude" in location && "longitude" in location) {
    return location;
  } else {
    const coords = [];
    for (const value in location) {
      if (types.includes(value)) {
        coords.push(location[value]);
      }
    }
    const latlng = { latitude: coords[0], longitude: coords[1] };
    return latlng;
  }
};

//* CONVIERTE UN OBJETO LATTITUD-LONGITUD A STRING
export const latlngToString = (latlng, reverse) => {
  if (reverse) {
    return Object.values(latlng).reverse().toString();
  } else {
    return Object.values(latlng).toString();
  }
};

//* FUNCION PARA NAVEGAR EN GOOGLE MAPS
export const goToGoogleMaps = (coords) => {
  const { latitude, longitude } = JSON.parse(coords);
  console.log("l", latitude, "Lo", longitude);
  const query = `${latitude},${longitude}`;
  const url = `google.navigation:q=${query}`;
  Linking.openURL(url);
};

//https://ul.waze.com/ul?ll=19.43563380%2C-99.14951070&navigate=yes
//* FUNCION PARA NAVEGAR EN WAZE
export const goToWaze = (coords) => {
  const { latitude, longitude } = JSON.parse(coords);
  const query = `${latitude},${longitude}`;
  const url = `https://ul.waze.com/ul?ll=${latitude}%2C${longitude}&navigate=yes`;
  Linking.openURL(url);
};

//* FUNCION PARA NAVEGAR EN IOS MAPS
export const goToIosMaps = (coords) => {
  const { latitude, longitude } = JSON.parse(coords);
  const query = `${latitude},${longitude}`;
  //const url = `http://maps.apple.com/?ll=${latitude},${longitude}`;
  const url = `maps://?sll=${latitude},${longitude}`;
  Linking.openURL(url);
};

//* DA FORMATO AL TIEMPO
export const parseMinutes = (minutes) => {
  if (minutes < 60) {
    const minuts = Math.round(minutes);
    return `${minuts} min`;
  } else {
    const hours = parseInt(minutes / 60);
    const minuts = minutes % 60;
    return `${hours} hr ${minuts} min`;
  }
};

//* FUNCION QUE OBTIENE EL ANGULO DE ROTACION AL MOMENTO DE QUERER HACER LA NAVEGACION
export const getRotationAngle = (currentLocation, markerLocation) => {
  const x1 = currentLocation.latitude;
  const y1 = currentLocation.longitude;
  const x2 = markerLocation.latitude;
  const y2 = markerLocation.longitude;

  const xDiff = x2 - x1;
  const yDiff = y2 - y1;

  return (Math.atan2(yDiff, xDiff) * 180.0) / Math.PI;
};

//* FORMATEAR EL OBJETO ADDRESS
export const getDirectionFromGeoReverse = (dir) => {
  const { street, subregion, name = "-" } = dir || {};
  if (street == null) {
    return `${subregion}`;
  } else {
    return `${street} # ${name.split("-")[0]}, ${subregion}`.replace(
      "# #",
      "# "
    );
  }
};
