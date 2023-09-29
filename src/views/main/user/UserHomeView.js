import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { getLocationPermissions } from "../../../library/utils/permissions.util";
import ServiceReservationForm from "../../../library/forms/usuario/";
import AppContainerMap from "../../../library/components/AppContainerMap";
import { InfoMessage } from "../../../library/components/Alert";
import { Title } from "../../../library/components/Typography";

import {
  subscribeToChannel,
  openConnection,
  closeConnection,
} from "../../../library/socketIO";
import { useCurrentLocationRegister } from "../../../library/hooks/location.hooks";
import useReserveTravelService from "../../../library/hooks/request/users/TravelReservations/useReserveTravelService.hooks";
import { setActiveServiceAction } from "../../../library/redux/actions/activeService.action";
import { capitalize } from "../../../library/utils/testFormat.util";
import moment from "../../../library/utils/moment";

export default function UserHomeView({ navigation, route }) {
  const { params = {} } = route;
  const dispatch = useDispatch();
  const {
    reserveTravelService,
    // reservationResponse,
    loading: reservationLoading,
    error: reservationError,
  } = useReserveTravelService();

  const [] = useState();
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

  const setActiveService = (t) => dispatch(setActiveServiceAction(t));

  const onSubmit = async () => {
    try {
      const {
        first_name,
        last_name,
        phone_number: client_contact,
        Zone: { code: zone_code },
      } = driver?.user || {};
      const client_name = capitalize(`${first_name} ${last_name}`);
      const { coords: client_coords, address: client_address } =
        myDirection || {};
      const { coords: destination_coords, address: destination_address } =
        destination || {};

      const { data: travelReservation } = await reserveTravelService({
        client_name,
        client_contact,
        client_address,
        notes: comments,
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
      const service = {
        ...travelReservation,
        isNew: true,
        created_at: moment().format(),
      };
      setActiveService(service);
      setTimeout(
        () =>
          navigation.navigate("ServiceDetail", {
            back: true,
            backRoute: "UserHome",
            isNew: true,
            service,
          }),
        800
      );
    } catch (error) {
      console.error(error);
    }
  };

  const selectUbication = () => {
    const inputPlaceholder =
      selectedInput == 1 ? "¿Donde estas?" : "¿A donde te diriges?";

    const showModalize = selectedInput == 2;
    navigation.navigate("PlacesPicker", {
      dest: "UserHome",
      inputPlaceholder,
      showModalize,
      myDirection,
    });
  };

  useEffect(() => {
    if (typeof address == "string")
      if (address) {
        setMyDirection({ address, coords: { latitude, longitude } });
      }
  }, [address]);

  useEffect(() => {
    if (route?.params?.selectedCoords) {
      const { selectedCoords: coords, selectedAddress: address } = params;
      if (address)
        if (selectedInput == 1) setMyDirection({ address, coords });
        else setDestination({ address, coords });
    }
  }, [route?.params?.selectedCoords]);

  const innit = () => {
    if (params?.reset) {
      console.log("reset");
      setDestination(null);
      setActiveService(null);
      setComments("");
    }
    registerListenerAndSubscriptions();
    if (!myDirection) updateUserLocation();
  };

  useEffect(() => {
    innit();
  }, [route?.params]);

  useEffect(() => {
    getLocationPermissions();
    innit();
    const focusSubscription = navigation.addListener("focus", () => {
      innit();
    });

    return () => {
      closeConnection();
      focusSubscription();
    };
  }, []);

  const formProps = {
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
  };

  return (
    <AppContainerMap
      navigation={navigation}
      backButton={false}
      drawerMenu={true}
    >
      {activeService != null && (
        <InfoMessage
          containerStyle={{ margin: 10 }}
          onPress={() => {
            navigation.navigate("ServiceDetail", {
              back: true,
              backRoute: "UserHome",
              isNew: true,
            });
          }}
        >
          Tienes un sevicio activo
        </InfoMessage>
      )}
      <Title style={styles.title}>Pedir taxi</Title>
      <ServiceReservationForm {...formProps} />
    </AppContainerMap>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: 10,
    marginHorizontal: 15,
  },
});
