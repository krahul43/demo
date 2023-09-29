import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Text } from "react-native";
import MapView, { Circle, Marker } from "react-native-maps";
import * as Location from "expo-location";
import Loading from "../components/Loading";

import { useTheme } from "react-native-paper";
export default () => {
  const {
    colors: { primary },
  } = useTheme();
  const [userLocation, setUserLocation] = useState(null);
  const mapRef = useRef(null);

  const getUserLocation = async () => {
    const { coords } = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    });
    const latlng = { latitude: coords.latitude, longitude: coords.longitude };
    setUserLocation(latlng);
  };

  useEffect(() => {
    //! CAPTURA LA POSICION DEL USUARIO AL ENTRAR A LA VISTA
    getUserLocation();
  }, []);

  return (
    <View style={styles.map}>
      {userLocation == null ? (
        <Loading isVisible={true} hasText={false} />
      ) : (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            ...userLocation,
            latitudeDelta: 0.012,
            longitudeDelta: 0.01,
          }}
          showsBuildings={true}
          showsMyLocationButton={false}
          showsUserLocation={true}
          onMapReady={() => console.log("map ready")}
          maxZoomLevel={20}
          minZoomLevel={10}
          onPress={(event) => {
            const latlng = event.nativeEvent.coordinate;
            console.log("on tap", latlng);
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
    height: "100%",
    position: "relative",
  },
});
