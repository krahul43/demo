import React, { useRef, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  AppState,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { List, IconButton, useTheme } from "react-native-paper";
import { Title } from "../../../library/components/Typography";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Loading from "../../../library/components/Loading";
import { FlatButton } from "../../components/Button";
import { ErrorMessage } from "../../components/Alert";
import { capitalize } from "../../utils/testFormat.util";
import moment from "../../utils/moment";
import { verifyConnection } from "../../utils/wifiConnection.util";
import { Modalize } from "react-native-modalize";
import { useDispatch, useSelector } from "react-redux";
import { useNetInfo } from "@react-native-community/netinfo";
import PorterActiveReservations from "./PorterActiveReservations";
import DirectionModalForm from "../../../library/forms/usuario/DirectionModalForm";
import InfoModal from "../../../library/components/InfoModal";
import AlertModal from "../../../library/components/AlertModal";
import {
  removeActiveServiceAction,
  updateActiveServiceAction,
} from "../../../library/redux/actions/porter/activeServicesActions";
import NetInfo from "@react-native-community/netinfo";

import { setInternetState } from "../../../library/redux/actions/internetAction";
import PorterReservationForm from "./PorterReservationForm";
import {
  getDirections,
  addDirection,
  removeDirection,
} from "../../networking/API";

import useTravelReservationService from "../../../library/hooks/request/drivers/travelReservation/useTravelReservationService.hooks";

import useCancelTravelReservationsService from "../../../library/hooks/request/drivers/travelReservation/useCancelTravelReservationsService.hooks";
import useDriversNarPoint from "../../../library/hooks/request/drivers/travelReservation/useDriversNarPoint.hooks";

import useSubscribeClientToTravelReservationTaken from "../../../library/hooks/SocketListeners/clients/useSubscribeClientToTravelReservationTaken.hooks";
import useSubscribeClientToTravelReservationDriverAtPlace from "../../../library/hooks/SocketListeners/clients/useSubscribeClientToTravelReservationDriverAtPlace.hooks";
import useSubscribeClientToTravelReservationFinished from "../../../library/hooks/SocketListeners/clients/useSubscribeClientToTravelReservationFinished.hooks";
import useSubscribeClientToTavelReservationCanceled from "../../../library/hooks/SocketListeners/clients/useSubscribeClientToTavelReservationCanceled.hooks";
import useSubscribeClientToTavelReservationETA from "../../../library/hooks/SocketListeners/clients/useSubscribeClientToTavelReservationETA.hooks";

import { useDimensions } from "../../hooks/device.hooks";

export default ({
  myDirection,
  setMyDirection,
  reservationLoading,
  reservationError,
  onSubmit,
  selectUbication,
  destination = null,
  setDestination,
  //setAddress,
  selectedInput,
  setSelectedInput,
  driver,
  comments,
  setComments,
  activeService,
  clientName,
  setClientName,
  navigation,
  registerListenerAndSubscriptions,
  updateUserLocation,
  closeConnection,
}) => {
  const {
    colors: { primary },
  } = useTheme();
  const { portrait: p, wp, hp } = useDimensions();
  const modalizeRef = useRef();
  const dispatch = useDispatch();
  const { isConnected } = useNetInfo();
  const {
    porterActiveServicesReducer: { data: porterActiveServices },
    userLocationReducer,
  } = useSelector(({ porterActiveServicesReducer, userLocationReducer }) => ({
    porterActiveServicesReducer,
    userLocationReducer,
  }));

  const [driversNear, setDriversNear] = useState([]);
  const [showModalize, setShowModalize] = useState(false);
  const [favoriteDirections, setFavoriteDirections] = useState([]);
  const [favoriteSelected, setFavoriteSelected] = useState(null);
  const [showAddFavorite, setShowAddFavorite] = useState(false);
  const [showRemoveFavorite, setShowRemoveFavorite] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [favoriteError, setFavoriteError] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const { loadTravelReservation } = useTravelReservationService();

  const { cancelTravelReservations } = useCancelTravelReservationsService();
  const { loadDriversNear, loading: driversNearLoading } = useDriversNarPoint();

  const closeAlert = () => setShowAlert(false);

  const notConnected = () => dispatch(setInternetState(false));

  const removeActiveService = (serviceId) =>
    dispatch(removeActiveServiceAction(serviceId));
  const updateActiveService = (service) =>
    dispatch(updateActiveServiceAction(service));

  const loadActiveServices = () => {
    registerListenerAndSubscriptions();
    porterActiveServices.map((s) => {
      const { id } = s;
      s.loading = true;
      updateActiveService(s);

      loadTravelReservation(id)
        .then((service) => {
          console.log({ service });
          if (service.canceled_at || service.finished_at)
            setTimeout(() => {
              removeActiveService(id);
            }, 8000);
          updateActiveService(service);
        })
        .catch((error) => {
          Alert.alert("load services", JSON.stringify(error, null, 4));
          Service.loading = false;
          updateActiveService(Service);
        });
    });
  };

  const loadActiveService = (id) => {
    porterActiveServices
      .filter(({ id: ID }) => id == ID)
      .map((s) => {
        const { id } = s;
        s.loading = true;
        updateActiveService(s);

        loadTravelReservation(id)
          .then((service) => {
            if (service.canceled_at || service.finished_at)
              setTimeout(() => {
                removeActiveService(id);
              }, 8000);
            updateActiveService(service);
          })
          .catch((error) => {
            Alert.alert("load services", JSON.stringify(error, null, 4));
            Service.loading = false;
            updateActiveService(Service);
          });
      });
  };

  const loadDriversNearRequest = async () => {
    try {
      if (!verifyConnection()) return;
      const driversNearResponse = await loadDriversNear();

      setDriversNear(driversNearResponse);
    } catch (error) {
      console.error(error);
    }
  };

  const cancelService = async (service) => {
    const Service = JSON.parse(JSON.stringify(service));
    const { id } = Service;
    try {
      Service.loading = true;
      updateActiveService(Service);
      await cancelTravelReservations(id);
      Service.canceled_at = moment().format();
      updateActiveService(Service);
      setTimeout(() => removeActiveService(id), 4000);
      Service.loading = false;
      Service.canceled = true;
      updateActiveServiceAction(Service);
    } catch (error) {
      Service.loading = false;
      updateActiveServiceAction(Service);
      Alert.alert(error);
    }
  };

  // open location modal
  const getFavoriteDirecctions = async () => {
    try {
      const directions = await getDirections(driver?.token);
      setFavoriteDirections(directions);
    } catch (error) {
      setShowAlert(true);
      setFavoriteDirections([]);
    }
  };

  const onTapLocation = (input) => {
    setSelectedInput(input);
    setShowModalize(true);
    modalizeRef.current.open();
  };

  // favorite directions
  const alreadyExist = (name) =>
    favoriteDirections.some(
      (item) => item.name.toLowerCase() == name.toLowerCase()
    );

  const isFavorite = (address) =>
    favoriteDirections
      ? favoriteDirections.some((item) => item.address == address)
      : false;

  const onTapFavorites = (input) => {
    setSelectedInput(input);
    isFavorite(myDirection?.address)
      ? setShowRemoveFavorite(true)
      : setShowAddFavorite(true);
  };

  const addFavoriteDirection = async (name) => {
    if (alreadyExist(name)) {
      Alert.alert("ALREADY EXIST");
      setFavoriteError(true);
    } else {
      const address =
        selectedInput == 1 ? myDirection?.address : destination?.address;
      const coords =
        selectedInput == 1
          ? JSON.stringify(myDirection?.coords)
          : JSON.stringify(destination?.coords);
      const favoriteAddress = new FormData();
      favoriteAddress.append("name", name);
      favoriteAddress.append("address", address);
      favoriteAddress.append("coords", coords);

      try {
        const apiResponse = await addDirection(driver?.token, favoriteAddress);
        if (selectedInput == 1)
          setMyDirection({
            ...apiResponse,
            coords: JSON.parse(apiResponse.coords),
          });
        else
          setDestination({
            ...apiResponse,
            coords: JSON.parse(apiResponse.coords),
          });
        setRefresh(!refresh);
        setShowAddFavorite(false);
      } catch (error) {
        setShowAlert(true);
        setShowAddFavorite(false);
      }
    }
  };

  const removeFavoriteDirection = async () => {
    try {
      const addressId = selectedInput == 1 ? myDirection?.id : destination?.id;
      await removeDirection(driver?.token, addressId);
      setRefresh(!refresh);
      setShowRemoveFavorite(false);
    } catch {
      setShowAlert(true);
      setShowRemoveFavorite(false);
    }
  };

  // listeners

  useSubscribeClientToTravelReservationTaken(
    porterActiveServices,
    (travelReservationId) => {
      const [service] = porterActiveServices.filter(
        ({ id }) => id == travelReservationId
      );
      if (!service) return Alert.alert("not found porter service");
      loadActiveService(travelReservationId);
    }
  );

  useSubscribeClientToTravelReservationDriverAtPlace(
    porterActiveServices,
    (travelReservationId) => {
      const [service] = porterActiveServices.filter(
        ({ id }) => id == travelReservationId
      );
      if (!service) return Alert.alert("not found porter service");
      service.driver_on_pickup_place_at = moment().format();
      updateActiveService(service);
    }
  );

  useSubscribeClientToTravelReservationFinished(
    porterActiveServices,
    (travelReservationId) => {
      const [service] = porterActiveServices.filter(
        ({ id }) => id == travelReservationId
      );
      if (!service) return Alert.alert("not found porter service");
      service.finished_at = moment().format();
      updateActiveService(service);
      setTimeout(() => removeActiveService(service.id), 8000);
    }
  );

  useSubscribeClientToTavelReservationCanceled(
    porterActiveServices,
    (travelReservationId) => {
      const [service] = porterActiveServices.filter(
        ({ id }) => id == travelReservationId
      );
      if (!service) return Alert.alert("not found porter service");
      service.canceled_at = moment().format();
      updateActiveService(service);
      setTimeout(() => removeActiveService(service.id), 8000);
    }
  );

  useSubscribeClientToTavelReservationETA(
    porterActiveServices,
    ({ travelReservationId, eta }) => {
      const [service] = porterActiveServices.filter(
        ({ id }) => id == travelReservationId
      );
      if (!service) return Alert.alert("not found porter service");
      service.eta = eta;
      updateActiveService(service);
    }
  );

  useEffect(() => {
    getFavoriteDirecctions();
  }, [refresh]);

  useEffect(() => {
    if (!showModalize && favoriteSelected) {
      if (selectedInput == 1) {
        setMyDirection({
          ...favoriteSelected,
          coords: JSON.parse(favoriteSelected.coords.replace("\\", "")),
        });
      } else {
        setDestination({
          ...favoriteSelected,
          coords: JSON.parse(favoriteSelected.coords.replace("\\", "")),
        });
      }
    }
  }, [showModalize]);

  const loadData = () => {
    if (myDirection) {
      loadActiveServices();
      loadDriversNearRequest();
    }
  };

  useEffect(() => {
    updateUserLocation();
    const onAppStateChange = (state) => {
      if (state == "active") loadData();
    };
    const netInfoSubscription = NetInfo.addEventListener((state) => {
      if (state.isConnected) loadData();
    });

    AppState.addEventListener("change", onAppStateChange);
    const focusSubsctiption = navigation.addListener("focus", () => {
      if (!myDirection) updateUserLocation();
      loadData();
    });
    return () => {
      AppState.removeEventListener("change", onAppStateChange);
      focusSubsctiption();
      closeConnection();
      netInfoSubscription();
    };
  }, []);

  useEffect(() => {
    loadData();
  }, [myDirection]);

  const activeServicesLoading = porterActiveServices.some(
    ({ loading }) => loading
  );

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Title style={{ marginTop: 8 }}>
            Pedir taxi <Icon name="taxi" size={18} />
          </Title>
          {driversNearLoading || activeServicesLoading ? (
            <ActivityIndicator
              color="gray"
              size="small"
              style={{ margin: 8 }}
            />
          ) : (
            <IconButton
              icon="refresh"
              size={24}
              color="#000"
              style={{ margin: 8 }}
              onPress={() => loadData()}
              disabled={driversNearLoading}
            />
          )}
        </View>
        <Text style={{ color: "gray", fontSize: 12, marginTop: -10 }}>
          ({driversNear.length} Cerca)
        </Text>
        <PorterReservationForm
          {...{
            myDirection,
            setMyDirection,
            reservationLoading,
            onSubmit,
            onTapLocation,
            notConnected,
            destination,
            setDestination,
            isFavorite,
            isConnected,
            onTapFavorites,
            comments,
            setComments,
            activeService,
            clientName,
            setClientName,
          }}
        />

        {porterActiveServices.length > 0 && (
          <PorterActiveReservations cancelService={cancelService} />
        )}

        {reservationError != null && (
          <ErrorMessage reload={reservationError}>
            {reservationError}
          </ErrorMessage>
        )}
      </ScrollView>
      <DirectionModalForm
        showModal={showAddFavorite}
        setShowModal={setShowAddFavorite}
        onConfirm={addFavoriteDirection}
        error={favoriteError}
        setError={setFavoriteError}
      />

      <InfoModal
        show={showRemoveFavorite}
        setShow={setShowRemoveFavorite}
        title={"Aviso"}
        message={"Estas seguro de eliminar esta direccion de tus favoritos?"}
        declineAction={true}
        confirmAction={removeFavoriteDirection}
      />
      <Loading
        isVisible={modalizeRef.current == null || favoriteDirections == null}
        hasText={false}
      />
      <AlertModal
        isVisible={showAlert}
        text={"Ocurrio un error, por favor verifica tu conexion a internet"}
        icon={"information"}
        closeFunction={closeAlert}
      />
      <Modalize
        ref={modalizeRef}
        snapPoint={200}
        modalTopOffset={hp(15)}
        HeaderComponent={() => (
          <View style={styles.modalizeHeaderView}>
            <Text style={styles.modalizeHeaderText}>
              {selectedInput == 1 ? "¿Donde estas?" : "¿A donde te diriges?"}
            </Text>
            <FlatButton
              onPress={() => {
                modalizeRef.current.close();
                setTimeout(() => {
                  selectUbication();
                }, 200);
              }}
              containerStyle={styles.modalizerButton}
              iconButton={true}
              textStyle={styles.modalizerButtonText}
              icon={
                <Icon name={"map-search-outline"} color={"white"} size={20} />
              }
              text="Fijar en mapa"
            />
          </View>
        )}
        flatListProps={{
          data: favoriteDirections,
          renderItem: ({ item, index }) => (
            <List.Item
              titleStyle={{ fontWeight: "bold", fontSize: 17 }}
              title={capitalize(item.name)}
              onPress={() => {
                setFavoriteSelected(item);
                setShowModalize(false);
                modalizeRef.current.close();
              }}
              description={capitalize(item.address)}
              left={(props) => (
                <List.Icon {...props} icon="star" color={"#F2B215"} />
              )}
            />
          ),
          keyExtractor: (item) => item.id.toString(),
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 0,
    //flexGrow:1,
    marginHorizontal: 15,
    padding: 3,
  },
  title: {
    textAlign: "center",
    marginTop: 5,
    marginBottom: 0,
  },
  paymentForm: {
    marginTop: -5,
  },
  rechargeStep: {
    marginVertical: 10,
  },
  stepText: {
    color: "grey",
    fontSize: 16,
    fontStyle: "italic",
  },
  row: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalizeHeaderView: {
    marginHorizontal: 15,
    paddingVertical: 15,
    borderBottomColor: "#aaa",
    borderBottomWidth: 1,
    borderRadius: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalizeHeaderText: {
    fontSize: 16,
    color: "#aaa",
    fontStyle: "italic",
  },
  modalizerButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "black",
    borderRadius: 200,
  },
  modalizerButtonText: {
    color: "white",
  },
  favoriteActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  activesTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
  },
  halfLine: {
    height: 1,
    backgroundColor: "gray",
    flex: 1,
  },
  activesTitle: {
    fontStyle: "italic",
    fontSize: 18,
  },
  activeRow: {
    paddingVertical: 12,
  },
  activeContainer: {
    borderWidth: 1,
    borderRadius: 4,
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: 12,
    paddingBottom: 10,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  activeLabelContainer: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    top: -17,
    left: 10,
    paddingHorizontal: 5,
    paddingVertical: 0,
    zIndex: 50,
  },
  activeLabelText: {
    fontStyle: "italic",
    fontWeight: "bold",
    fontSize: 16,
    paddingTop: 4,
  },
  activeDetails: {
    flex: 1,
  },
  activeActions: {
    // flexDirection:'row',
    // alignItems:'center'
  },
  stateView: {
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderWidth: 1,
    borderRadius: 100,
    marginTop: 5,
  },
  notesText: {
    color: "#5D6D7E",
    fontStyle: "italic",
    fontSize: 15,
  },
  clientText: {
    color: "black",
    fontStyle: "italic",
    fontSize: 15,
  },
  dateText: {
    color: "gray",
    fontStyle: "italic",
    fontSize: 13,
  },
  cancelActive: {
    padding: 2,
    // backgroundColor: "red",
    // borderRadius: 100,
  },
  infoContainer: {
    marginTop: 5,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    //justifyContent:'center'
  },
  infoText: {
    fontStyle: "italic",
    fontSize: 15,
    marginLeft: 10,
  },
});
