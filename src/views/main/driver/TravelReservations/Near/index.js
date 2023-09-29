//
import React, { useState, useEffect } from "react";
import IdleTimerManager from "react-native-idle-timer";
import {
  getLocationPermissions,
  getOverlayPermissions,
} from "../../../../../library/utils/permissions.util";
import {
  FlatList,
  StyleSheet,
  View,
  Alert,
  AppState,
  Text,
} from "react-native";
import { openSettings } from "react-native-permissions";
import * as Speech from "expo-speech";
import { useDispatch, useSelector } from "react-redux";
import { IconButton } from "react-native-paper";
import { useTheme } from "react-native-paper";
import useSubscribeToNewNearTravelReservationHook from "../../../../../library/hooks/SocketListeners/drivers/useSubscribeToNewNearTravelReservation.hooks";
import useSubscribeToRemoveNearTravelReservationHook from "../../../../../library/hooks/SocketListeners/drivers/useSubscribeToRemoveNearTravelReservation.hooks";
import useLoadNearTravelReservations from "../../../../../library/hooks/request/drivers/travelReservation/useLoadNearTravelReservations.hooks";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import SoundPlayer from "react-native-sound-player";
import {
  getNewNearServicesFromAsyncStorage,
  setNewNearServicesToAsyncStorage,
  setLocationCounterToAsyncStorage,
} from "../../../../../library/utils/syncStorage.utils";
import * as NetInfo from "@react-native-community/netinfo";
import { useCurrentLocationRegister } from "../../../../../library/hooks/location.hooks";
import { socket } from "../../../../../library/socketIO";
import PushNotification from "react-native-push-notification";
import {
  subscribeToChannel,
  subscribeToZone,
  openConnection,
  closeConnection,
} from "../../../../../library/socketIO";
import AppContainerMap from "../../../../../library/components/AppContainerMap";
import SwipeableRow from "../../../../../library/components/SwipeableRow";
import ServiceItem from "./ServiceItem";
import {
  Caption,
  Title,
  Subheading,
} from "../../../../../library/components/Typography";
import { InfoMessage } from "../../../../../library/components/Alert";
import {
  getAppData,
  useBackgroundTimer,
} from "../../../../../../TasksRegistry";

import useTakeTravelReservationsService from "../../../../../library/hooks/request/drivers/travelReservation/useTakeTravelReservationsService.hooks";
import { distance } from "../../../../../library/hooks/location.hooks";
import { useToggleDriverAvailability } from "../../../../../library/hooks/users/driversComunicationRegistry.hooks";
import {
  removeTravelReservationAction,
  updateTravelReservationAction,
  addTravelReservationAction,
  preRemoveTravelReservationAction,
} from "../../../../../library/redux/actions/taxista/travelReservations/nearTravelReservationsAction";
import { setActiveServiceAction } from "../../../../../library/redux/actions/activeService.action";
import InfoModal from "../../../../../library/components/InfoModal";

export default function ServicesListView({ navigation }) {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const [refreshTimeout, setRefreshTimeout] = useState(null);
  const [focus, setFocus] = useState(true);
  const {
    travelReservations,
    loading: travelReservationsLoading,
    userLocation,
  } = useSelector(({ nearTravelReservationsReducer, userLocationReducer }) => ({
    ...nearTravelReservationsReducer,
    userLocation: userLocationReducer,
  }));
  // driver info
  const { driver } = useSelector(({ driverReducer }) => driverReducer);
  const { isNew: activeService } = useSelector(
    ({ activeServiceReducer }) => activeServiceReducer || {}
  );

  const { id, Zone, available } = driver?.user || {};
  const {
    colors: { primary },
  } = useTheme();
  const [refresh, setRefresh] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  const registerListenerAndSubscriptions = () => {
    openConnection();
    subscribeToChannel(id);
    subscribeToZone(Zone.code);
  };

  const updateUserLocation = useCurrentLocationRegister();
  const loadTravelReservations = useLoadNearTravelReservations();
  const toggleDriverAvailability = useToggleDriverAvailability();

  const { innitTimer, stopTimer } = useBackgroundTimer();

  const addTravelReservation = (travelReservation) =>
    dispatch(addTravelReservationAction(travelReservation));

  const takeTravelReservations = useTakeTravelReservationsService();

  const setActiveService = (t) => dispatch(setActiveServiceAction(t));

  const removeTravelReservation = (travelReservationId, preRemove = true) => {
    if (preRemove) preRemoveTravelReservation(travelReservationId);
    setTimeout(() => {
      dispatch(removeTravelReservationAction(travelReservationId));
      setRefresh(!refresh);
    }, 3000);
  };

  const preRemoveTravelReservation = (travelReservationId) => {
    dispatch(preRemoveTravelReservationAction(travelReservationId));
    setRefresh(!refresh);
  };
  useSubscribeToNewNearTravelReservationHook(driver?.user, focus, (tr) => {
    if (AppState.currentState == "active") {
      SoundPlayer.playSoundFile("taxi", "mp3");
      addTravelReservation(tr);
      tellUserAboutNewService(tr);
      PushNotification.localNotification({
        message: `Nuevo servicio en ${tr.client_address}`,
        channelId: "fcm_fallback_notification_channel",
        allowWhileIdle: true, // (optional) set notification to work while on doze, default: false
        color: "#F2B215",
        vibrate: true,
        // soundName: "taxi.mp3", // (optional) See `soundName` parameter of `localNotification` function
        playSound: false,
      });
    }
  });

  useSubscribeToRemoveNearTravelReservationHook(
    driver?.user,
    removeTravelReservation
  );

  const updateTravelReservation = (travelReservation) => {
    dispatch(updateTravelReservationAction(travelReservation));
    setRefresh(!refresh);
  };

  const acceptService = (travelReservation) => {
    travelReservation = { ...travelReservation };
    travelReservation.accepted = true;
    updateTravelReservation(travelReservation);
  };

  const isLoading = () =>
    travelReservations.filter(({ loading }) => loading).length > 0;

  const verifyDistanceAndConfirm = (travelReservation) => {
    let { client_coords } = travelReservation;
    client_coords = JSON.parse(client_coords);
    const dist = distance(client_coords, userLocation.coords);
    if (dist >= 2500) {
      const message = `El servicio que desea tomar esta a una distancia de ${dist} metros, ¿esta seguro de que desea tomarlo?`;
      Speech.stop();
      Speech.speak(message);
      Alert.alert(
        "Lugar de ubicación lejano",
        message,
        [
          {
            text: "Cancelar",
            onPress: () => Speech.stop(),

            style: "cancel",
          },
          {
            text: "Aceptar",
            onPress: () => {
              Speech.stop();
              confirmService(travelReservation);
            },
          },
        ],
        {
          cancelable: false,
        }
      );
    } else confirmService(travelReservation);
  };

  const confirmService = async (travelReservation) => {
    try {
      travelReservation = { ...travelReservation };
      travelReservation.loading = true;
      updateTravelReservation(travelReservation);
      const { id } = travelReservation;
      const {
        data: { error },
      } = await takeTravelReservations(id);
      if (error) throw new Error(error);
      removeTravelReservation(id, false);
      toggleDriverAvailability(false);
      travelReservation.loading = false;
      updateTravelReservation(travelReservation);
      setActiveService({ ...travelReservation, isNew: true });
      setTimeout(
        () =>
          navigation.navigate("ServiceDetail", {
            back: true,
            backRoute: "Services",
            service: null,
          }),
        200
      );
    } catch (error) {
      travelReservation.loading = false;
      updateTravelReservation(travelReservation);
      removeTravelReservation(id);
      const insuficient = error.message.indexOf("insuficient") != -1;
      Alert.alert(
        insuficient ? "Saldo insuficiente" : "Servicio no disponible",
        insuficient
          ? "Debes tener al menos $600 COP en tu cuenta para tomar un servicio"
          : "El servicio ya fue asignado a otro conductor o fue cancelado por demora en la asignación",
        insuficient
          ? [
              {
                text: "Billetera",
                onPress: () => navigation.navigate("Wallet"),
              },
              {
                text: "Aceptar",
                onPress: () => {},
              },
            ]
          : [
              {
                text: "Aceptar",
                onPress: () => {},
              },
            ]
      );
    }
  };

  const refresh_ = () => {
    if (refreshTimeout) clearTimeout(refreshTimeout);
    setRefreshTimeout(
      setTimeout(() => {
        setRefresh(!refresh);
        refresh_();
      }, 59000)
    );
  };

  const tellUserAboutNewService = (travelReservation) => {
    const { client_address, client_coords } = travelReservation;
    const dist = distance(userLocation.coords, JSON.parse(client_coords));
    Speech.speak(`Nuevo servicio a ${dist} metros en ${client_address}`);
  };

  const checkNewServices = async () => {
    const newServices = await getNewNearServicesFromAsyncStorage();
    travelReservations.map((travelReservation) => {
      const { id } = travelReservation;
      newServices.map((travelId) => {
        if (id === travelId) {
          tellUserAboutNewService(travelReservation);
        }
      });
    });
    await setNewNearServicesToAsyncStorage([]);
  };

  const overlayMessage = () =>
    Alert.alert(
      "¿Problemas con la sobreposición de la aplicación?",
      'Verifica si tu dispositivo requiere un permiso especial para la sobreposición de la app, puedes revisar en la configuracion la sección de permisos (revisar si hay una sección de otros permisos o permisos especiales) y habilitar la opción "Mostrar ventanas emergentes mientras se ejecuta en segundo plano"',
      [
        {
          text: "Abrir configuración",
          onPress: () => openSettings(),
        },
        {
          text: "Cancelar",
          type: "cancel",
          onPress: () => {},
        },
      ]
    );

  const UpdateUserLocation = () =>
    setTimeout(async () => await updateUserLocation(), 500);

  useEffect(() => {
    getLocationPermissions();
    getOverlayPermissions();

    UpdateUserLocation();
    const focusUnsubscribe = navigation.addListener("focus", () => {
      registerListenerAndSubscriptions();
      UpdateUserLocation();
    });

    refresh_();

    const appFocus = (state) => {
      UpdateUserLocation();
      if (state == "background") {
        const IID = innitTimer();
        console.log({ IID });
        if (IID > 1) stopTimer(IID);
        setFocus(false);
      } else {
        setTimeout(() => {
          console.log({ focus: true });
          registerListenerAndSubscriptions();
          setFocus(true);
        }, 1300);
      }
    };
    AppState.addEventListener("change", appFocus);
    IdleTimerManager.setIdleTimerDisabled(true);

    const netInfoSubscription = NetInfo.addEventListener(async (state) => {
      if (state.isConnected) {
        UpdateUserLocation();
        openConnection();
        setTimeout(() => {
          if (!socket.connected) {
            let intervalID = null;
            intervalID = setInterval(() => {
              if (socket.connected) {
                registerListenerAndSubscriptions();
                setFocus(true);
                if (intervalID) {
                  clearInterval(intervalID);
                  intervalID = null;
                }
                setTimeout(() => setRefresh(!refresh), 1000);
              }
            }, 1000);
          }
        }, 1000);

        console.log("conected");
      } else {
        setFocus(false);
      }
    });

    socket.on("connect", () => {
      setTimeout(() => {
        registerListenerAndSubscriptions();
        console.log("connect fore");
      }, 1000);
    });

    return () => {
      focusUnsubscribe();
      closeConnection();
      stopTimer();
      netInfoSubscription();
      IdleTimerManager.setIdleTimerDisabled(false);

      if (refreshTimeout) {
        clearTimeout(refreshTimeout);
        setRefreshTimeout(null);
      }
    };
  }, []);

  useEffect(() => {
    if (available) {
      UpdateUserLocation();
      registerListenerAndSubscriptions();
    }
  }, [available]);

  useEffect(() => {
    if (Object.keys(userLocation).length) {
      setLocationCounterToAsyncStorage(0);
      registerListenerAndSubscriptions();
      loadTravelReservations();
      openConnection();
    }
  }, [userLocation]);

  useEffect(() => {
    if (travelReservations.length) {
      checkNewServices();
    }
  }, [travelReservations]);

  console.log({ socketConnected: socket.connected });

  return (
    <AppContainerMap navigation={navigation} availability={true}>
      {activeService != null && (
        <InfoMessage
          containerStyle={{ margin: 10 }}
          onPress={() => {
            navigation.navigate("ServiceDetail", {
              back: true,
              backRoute: "Services",
              service: null,
            });
          }}
        >
          Tienes un sevicio activo
        </InfoMessage>
      )}
      <View style={{ ...styles.row, marginVertical: 10, marginHorizontal: 13 }}>
        <View style={{ ...styles.row, flex: 1 }}>
          <Title style={{ marginRight: 10 }}>Servicios Disponibles</Title>
          <Icon
            name="information"
            size={24}
            color={"black"}
            onPress={() => setShowInfoModal(true)}
          />
        </View>

        <IconButton
          disabled={travelReservationsLoading}
          icon="refresh"
          size={24}
          onPress={UpdateUserLocation}
        />
      </View>

      <Subheading
        onPress={overlayMessage}
        style={{
          marginHorizontal: 15,
          marginTop: -15,
          textDecorationLine: "underline",
        }}
      >
        ¿No se sobrepone la aplicación?
      </Subheading>
      <FlatList
        refreshing={travelReservationsLoading}
        onRefresh={UpdateUserLocation}
        data={travelReservations
          .map((travelReservation) => {
            const { client_coords } = travelReservation;
            travelReservation.distance = distance(
              userLocation.coords,
              JSON.parse(client_coords)
            );
            return travelReservation;
          })
          .sort((a, b) => {
            if (a.distance > b.distance) {
              return 1;
            }
            if (a.distance < b.distance) {
              return -1;
            }
            return 0;
          })}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <SwipeableRow onDelete={removeTravelReservation} index={item.id}>
            {ServiceItem(item, index, {
              confirmService: verifyDistanceAndConfirm,
              acceptService,
              isLoading,
              colors,
              activeService,
            })}
          </SwipeableRow>
        )}
        extraData={refresh}
        ListFooterComponent={
          <>
            {!travelReservations.length && !travelReservationsLoading && (
              <View style={styles.notResultsContainer}>
                <Caption style={styles.notResultsText}>
                  No hay reservaciones de servicio cerca del lugar.
                </Caption>
              </View>
            )}
          </>
        }
      />

      <InfoModal
        show={showInfoModal}
        setShow={setShowInfoModal}
        title={"Solicitud de la reserva por color"}
        message={
          "El color del icono en las reservaciones disponibles indica que tipo de usuario lo solicito:"
        }
        confirmAction={() => setShowInfoModal(false)}
        declineAction={false}
        children={
          <View style={{ ...styles.infoContainer, marginTop: 10 }}>
            <View style={styles.row}>
              <Icon name="map-marker" size={24} color={"#9575CD"} />
              <Text style={styles.infoText}>
                Servicio solicitado por un portero
              </Text>
            </View>
            <View style={{ ...styles.row, marginTop: 5 }}>
              <Icon name="map-marker" size={24} color={primary} />
              <Text style={styles.infoText}>
                Servicio solicitado por un cliente
              </Text>
            </View>
          </View>
        }
      />
    </AppContainerMap>
  );
}

const styles = StyleSheet.create({
  notResultsContainer: {
    width: "100%",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 15,
  },
  notResultsText: {
    textAlign: "center",
    fontSize: 19,
  },
  title: {
    //marginVertical: 13,
    //marginHorizontal: 15,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    fontStyle: "italic",
    fontSize: 15,
    marginLeft: 10,
  },
});
