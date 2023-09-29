import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Text,
  ActivityIndicator,
} from "react-native";
import MapView, { Circle, Marker } from "react-native-maps";
import * as Location from "expo-location";
import { FAB, Colors, useTheme } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Modalize } from "react-native-modalize";
import { MaterialCommunityIcons as MIcon } from "@expo/vector-icons";

import AppContainerMap from "../components/AppContainerMap";
import Loading from "../components/Loading";

import { distanceWithMeasurement } from "../utils/testFormat.util";
import { distance as getDistance } from "../hooks/location.hooks";

import {
  getLatLng,
  getDirectionFromGeoReverse,
  latlngToString,
} from "../utils/mapUtils";
import { getAddressSuggestions } from "../networking/API";

//? Effect para la vista anterior
// useEffect(() => {
//   console.log('PARAMS: ',params); //? Lo que quiera hacer con los params
// }, [params])

export default function PlacesPicker({ navigation, route: { params } }) {
  const { dest, inputPlaceholder = "Buscar", showModalize = false } = params;
  const {
    colors: { primary },
  } = useTheme();
  const [mapLoading, setMapLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [markerAddress, setMarkerAddress] = useState("");
  const [markerLocation, setMarkerLocation] = useState(null);
  const [inputText, setInputText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const modalizeRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const inputRef = useRef(null);

  const getAddress = async (coords) => {
    //! OBTIENE LA DIRECCION DE UNAS COORDENADAS (CON EXPO) Y LAS FORMATEA PARA MOSTRARLAS EN EL MARKER
    const addressObject = await Location.reverseGeocodeAsync(coords);
    const formatedAddress = getDirectionFromGeoReverse(addressObject[0]);
    setMarkerAddress(formatedAddress);
  };

  const openModalize = () => {
    //! ABRE EL MODAL
    if (showModalize) modalizeRef.current.open();
  };

  const closeModalize = () => {
    //! CIERRA EL MODAL
    if (showModalize) modalizeRef.current.close();
  };

  const onTap = async (latlng, placeInfo = null) => {
    // CAPTURA LAS COORDENADAS Y ACTUALIZA EL MARKER CUANDO SE HACE TAP EN EL MAPA
    closeModalize();
    setMarkerAddress("...");
    setShowSuggestions(false);
    setMarkerLocation(latlng);
    if (placeInfo) {
      goToLocation(latlng);
      const cityIndex = placeInfo.secondary_text.indexOf(",");
      const city = placeInfo.secondary_text.substring(0, cityIndex);
      const simplifyAddress = `${placeInfo.main_text}, ${city}`;
      setMarkerAddress(simplifyAddress);
      setInputText(
        `${placeInfo.main_text}, ${placeInfo.secondary_text}`
          .replace("# #", "# ")
          .replace("null", "")
      );
    } else {
      await getAddress(latlng);
    }
    openModalize();
  };

  const onSearchPlace = async () => {
    //! AL DARLE AL BOTON BUSCAR DE LA BARRA SE ACTIVA LA PETICION DEL SERVICIO DE GOOGLE (SUGERENCIAS)
    setShowSuggestions(true);
    setSuggestions([]);
    const { predictions } = await getAddressSuggestions(
      inputText,
      latlngToString(userLocation, false)
    );
    setSuggestions(predictions);
    inputRef.current.blur();
  };

  const onTapSuggestion = async (suggestionObject) => {
    //! AL HACER TAP EN UNA SUGERENCIA
    setShowSuggestions(false);
    setSuggestions([]);
    const completeAddress = `${suggestionObject.main_text}, ${suggestionObject.secondary_text}`;
    const subAddresssIndex = suggestionObject.secondary_text.indexOf(",");
    const subAddress = suggestionObject.secondary_text.substring(
      0,
      subAddresssIndex
    );
    const simplifyAddress = `${suggestionObject.main_text}, ${subAddress}`;
    //const coords = await getAddressCoords(completeAddress); //* SERVICIO DE GOOGLE
    let coords = await Location.geocodeAsync(completeAddress); //* SERVICIO DE EXPO
    //* SI NO FUNCIONA CON UNA DIRECCION PROBAR CON LA SIMPLIFICADA
    if (coords.length == 0) {
      //Condicional solo para busqeudas en expo
      coords = await Location.geocodeAsync(simplifyAddress);
    }
    const location = getLatLng(coords[0]);
    await onTap(location, suggestionObject);
  };

  const getUserLocation = async () => {
    //! SE OBTIENE LA POSICION DEL USUARIO
    if (params?.myDirection) {
      setUserLocation(params?.myDirection?.coords);
    } else {
      const { coords } = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });
      const latlng = { latitude: coords.latitude, longitude: coords.longitude };
      setUserLocation(latlng);
    }
  };

  const goToLocation = (location) => {
    //! IR A ALGUNA LOCACION
    setTimeout(() => {
      mapRef.current.animateCamera(
        {
          center: location,
        },
        350
      );
    }, 50);
  };

  const goBack = () => {
    //! FUNCION DEL BOTON DE ATRAS
    navigation.navigate(dest, { selectedAddress: null });
  };

  useEffect(() => {
    //! CAPTURA LA POSICION DEL USUARIO AL ENTRAR A LA VISTA
    getUserLocation();
  }, []);

  useEffect(() => {
    //! CAMBIA EL TOOLTIP DE LOS MARKERS
    if (!mapLoading && markerAddress != "...") {
      setInputText(markerAddress);
      markerRef.current.showCallout();
    }
  }, [markerAddress]);

  useEffect(() => {
    if (!mapLoading && markerAddress) {
      markerRef.current.showCallout();
    }
  }, [markerLocation]);

  const sheetContent = () => {
    //! CONTENIDO DEL MODAL
    // const baseRate = 3600;
    if (!userLocation || !markerLocation)
      return (
        <View style={styles.modalizeContent}>
          <ActivityIndicator size="large" color={primary} />
        </View>
      );
    const distance = getDistance(userLocation, markerLocation);
    const distanceText = distanceWithMeasurement(distance);
    // const rate = Math.ceil(((distance / 78) * 110 + baseRate) / 100) * 100;
    return (
      <View style={styles.modalizeContent}>
        <View style={{ height: 10 }} />
        <View style={styles.modalizeRow}>
          <MIcon name="road-variant" size={32} />
          <View style={{ width: 10 }} />
          <Text style={{ color: Colors.grey400, fontSize: 24 }}>
            {distanceText}
          </Text>
        </View>
        <View style={{ height: 10 }} />
        {/* <View style={styles.modalizeRow}>
          <MIcon name="currency-usd" size={32} />
          <View style={{ width: 10 }} />
          <Text style={{ color: Colors.grey400, fontSize: 24 }}>
            {rate} COP
          </Text>
        </View> */}
      </View>
    );
  };

  return (
    <AppContainerMap
      backButton={true}
      backButtonFunction={goBack}
      drawerMenu={false}
      navigation={navigation}
    >
      {userLocation == null ? (
        <Loading isVisible={true} hasText={false} />
      ) : (
        <View style={{ flex: 1 }}>
          <View style={styles.searchPlaceContainer}>
            <View style={styles.addressInputContainer}>
              <TextInput
                style={styles.addressInput}
                placeholder={inputPlaceholder}
                ref={inputRef}
                onChangeText={(text) => setInputText(text)}
                value={inputText}
              />
              <TouchableOpacity
                style={styles.searchIconContainer}
                onPress={() => onSearchPlace()}
              >
                <Icon name={"magnify"} size={24} color={"black"} />
              </TouchableOpacity>
            </View>
            {showSuggestions && (
              <FlatList
                data={suggestions}
                keyExtractor={(item) => item.place_id}
                contentContainerStyle={styles.suggestionListContainer}
                ListEmptyComponent={() => (
                  <View style={styles.suggestionLoadingContainer}>
                    <ActivityIndicator color={"black"} />
                  </View>
                )}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    onPress={() => onTapSuggestion(item.structured_formatting)}
                    style={styles.suggestionRowContainer}
                  >
                    <Text style={styles.suggestionText}>
                      {item.description}
                    </Text>
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => (
                  <View style={styles.suggestionSeparator} />
                )}
              />
            )}
          </View>
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
            onMapReady={() => {
              setMapLoading(false);
              setInputText(markerAddress);
              markerRef.current.showCallout();
            }}
            maxZoomLevel={20}
            minZoomLevel={10}
            onPress={(event) => {
              const latlng = event.nativeEvent.coordinate;
              onTap(latlng);
            }}
          >
            <Circle
              center={userLocation}
              radius={100}
              fillColor={"rgba(230,238,255,0.5)"}
              strokeColor={"#1a66ff"}
            />
            <Marker
              ref={markerRef}
              coordinate={markerLocation ? markerLocation : userLocation}
              title={markerAddress}
            />
          </MapView>
          <Modalize
            ref={modalizeRef}
            withOverlay={false}
            adjustToContentHeight={true}
            modalStyle={{ zIndex: 3 }}
          >
            {sheetContent()}
            <View style={styles.buttonsContainer}>
              <FAB
                style={{ backgroundColor: Colors.grey100 }}
                icon="crosshairs-gps"
                color={Colors.blue500}
                onPress={() => {
                  goToLocation(userLocation);
                  onTap(userLocation);
                }}
              />
              {markerLocation && (
                <>
                  <View style={{ height: 10 }}></View>
                  <FAB
                    style={{ backgroundColor: "#F2B215" }}
                    icon="check-bold"
                    color={"black"}
                    onPress={() => {
                      navigation.navigate(dest, {
                        selectedAddress: inputText,
                        selectedCoords: markerLocation,
                        reset: false,
                      });
                    }}
                  />
                </>
              )}
            </View>
          </Modalize>

          <View style={styles.buttonsContainer}>
            <FAB
              style={{ backgroundColor: Colors.grey100 }}
              icon="crosshairs-gps"
              color={Colors.blue500}
              onPress={() => {
                goToLocation(userLocation);
                onTap(userLocation);
                closeModalize();
              }}
            />
            {markerLocation && (
              <>
                <View style={{ height: 10 }}></View>
                <FAB
                  style={{ backgroundColor: "#F2B215" }}
                  icon="check-bold"
                  color={"black"}
                  onPress={() => {
                    navigation.navigate(dest, {
                      selectedAddress: inputText,
                      selectedCoords: markerLocation,
                      reset: false,
                    });
                  }}
                />
              </>
            )}
          </View>
          <Loading
            isVisible={
              mapLoading ||
              markerRef.current == null ||
              inputRef.current == null
            }
            hasText={false}
          />
        </View>
      )}
    </AppContainerMap>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  searchPlaceContainer: {
    position: "absolute",
    backgroundColor: "transparent",
    zIndex: 1,
    width: "100%",
    height: "auto",
    top: 10,
  },
  addressInputContainer: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "#ccc",
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    alignSelf: "center",
    backgroundColor: "#fff",
  },
  addressInput: {
    fontSize: 16,
    paddingHorizontal: 8,
    paddingVertical: 5,
    flex: 1,
  },
  searchIconContainer: {
    backgroundColor: "#F2B215",
    justifyContent: "center",
    paddingHorizontal: 8,
    alignSelf: "stretch",
  },
  suggestionListContainer: {
    width: "90%",
    alignSelf: "center",
  },
  suggestionLoadingContainer: {
    height: 100,
    width: "100%",
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  suggestionRowContainer: {
    backgroundColor: "white",
    paddingHorizontal: 8,
    paddingVertical: 5,
    width: "100%",
  },
  suggestionText: {
    fontSize: 16,
    fontStyle: "italic",
  },
  suggestionSeparator: {
    height: 1,
    backgroundColor: "#ccc",
    width: "100%",
  },
  buttonsContainer: {
    position: "absolute",
    bottom: 16,
    right: 16,
    zIndex: 3,
  },
  modalizeContent: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 25,
    zIndex: 2,
  },
  modalizeRow: {
    flexDirection: "row",
    alignItems: "center",
  },
});
