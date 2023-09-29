import React, { useState, useEffect } from "react";
import { StyleSheet, Alert } from "react-native";
import { useSelector, useDispatch } from "react-redux";

import PorterReservationForm from "../../../library/forms/portero/";
import AppContainerMap from "../../../library/components/AppContainerMap";
import {
  subscribeToChannel,
  openConnection,
  closeConnection,
} from "../../../library/socketIO";
import { useCurrentLocationRegister } from "../../../library/hooks/location.hooks";
import useReserveTravelService from "../../../library/hooks/request/users/TravelReservations/useReserveTravelService.hooks";
import { addActiveServiceAction } from "../../../library/redux/actions/porter/activeServicesActions";
import { capitalize } from "../../../library/utils/testFormat.util";
import { verifyConnection } from "../../../library/utils/wifiConnection.util";
import moment from "../../../library/utils/moment";

export default function PorterHomeView({ navigation, route: { params = {} } }) {
  //console.log(params);
  const dispatch = useDispatch();
  const {
    reserveTravelService,
    // reservationResponse,
    loading: reservationLoading,
    error: reservationError,
  } = useReserveTravelService();

  const [clientName, setClientName] = useState("");
  const {
    userLocationReducer: {
      address,
      coords: { longitude, latitude },
    },
    driverReducer: { driver },
  } = useSelector(({ userLocationReducer, driverReducer }) => ({
    userLocationReducer,
    driverReducer,
  }));
  const { id, Zone } = driver?.user || {};
  const { isNew: activeService } = useSelector(
    ({ activeServiceReducer }) => activeServiceReducer || {}
  );

  const [destination, setDestination] = useState(null);
  const [myDirection, setMyDirection] = useState(null);
  const [selectedInput, setSelectedInput] = useState(1);
  const [comments, setComments] = useState("");

  const updateUserLocation = useCurrentLocationRegister();

  const registerListenerAndSubscriptions = () => {
    openConnection();
    subscribeToChannel(id);
  };

  useEffect(() => {
    if (typeof address == "string")
      if (address) {
        setMyDirection({ address, coords: { latitude, longitude } });
      }
  }, [address]);

  useEffect(() => {
    if (params?.selectedCoords) {
      const { selectedCoords: coords, selectedAddress: address } = params;
      if (address)
        if (selectedInput == 1) setMyDirection({ address, coords });
        else setDestination({ address, coords });
    }
  }, [params.selectedCoords]);

  useEffect(() => {
    if (params?.reset) {
      setDestination(null);
    }
  }, [params.reset]);

  const addActiveService = (t) => dispatch(addActiveServiceAction(t));

  const onSubmit = async () => {
    try {
      if (!clientName)
        return Alert.alert(
          "Información del cliente",
          "Ingresa el nombre de la persona que solicita el taxi"
        );
      const {
        phone_number: client_contact,
        Zone: { code: zone_code },
      } = driver?.user || {};
      const client_name = capitalize(clientName);
      const { coords: client_coords, address: client_address } =
        myDirection || {};
      const { coords: destination_coords, address: destination_address } =
        destination || {};

      if (!verifyConnection()) return;

      const { data: travelReservation } = await reserveTravelService({
        client_name,
        client_contact,
        client_address,
        notes: comments,
        is_porter: 1,
        zone_code,
        ...(client_coords
          ? { client_coords: JSON.stringify(client_coords) }
          : {}),
        ...(destination_coords
          ? {
              destination_coords: JSON.stringify(destination_coords),
              destination_address,
            }
          : {}),
      });
      addActiveService({ ...travelReservation, created_at: moment().format() });
      setClientName("");
      setComments("");
    } catch (error) {
      console.error(error);
    }
  };

  const selectUbication = () => {
    const inputPlaceholder =
      selectedInput == 1 ? "¿Donde estas?" : "¿A donde te diriges?";

    const showModalize = selectedInput == 2;
    navigation.navigate("PlacesPicker", {
      dest: "PorterHome",
      inputPlaceholder,
      showModalize,
      myDirection,
    });
  };

  return (
    <AppContainerMap
      navigation={navigation}
      backButton={false}
      drawerMenu={true}
      backRoute="PorterHome"
    >
      <PorterReservationForm
        {...{
          onSubmit,
          navigation,
          myDirection,
          setMyDirection,
          reservationLoading,
          reservationError,
          selectUbication,
          destination,
          setDestination,
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
        }}
      />
    </AppContainerMap>
  );
}
