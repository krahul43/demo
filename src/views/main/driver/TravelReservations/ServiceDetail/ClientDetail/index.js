import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useTheme } from "react-native-paper";

import DriverCard from "../DriverCard";
import {
  ErrorMessage,
  InfoMessage,
} from "../../../../../../library/components/Alert";
import { SubmitButton as Button } from "../../../../../../library/components/Button";
import Loading from "../../../../../../library/components/Loading";

import { getNearDrivers } from "../../../../../../library/networking/API";
import {
  useDimensions,
  wp,
} from "../../../../../../library/hooks/device.hooks";
import moment from "../../../../../../library/utils/moment";
import { capitalize } from "../../../../../../library/utils/testFormat.util";

import PendingService from "./PendingService";
import ServiceAccepted from "./ServiceAccepted";
export default ({
  travelReservation,
  loadingCancelTravelReservations,
  errorCancelTravelReservations,
  cancelService,
  canceled,
  finished,
  loadTravelReservationError,
  driver,
  loadActiveService,
  loadDriverInfoLoading,
  loadDriverInfoError,
  userLocationReducer,
  setShowCancelConfirmation,
}) => {
  const { portrait: p, hp } = useDimensions();
  const {
    colors: { darkBrand, success, primary },
  } = useTheme();
  const [nearDrivers, setNearDrivers] = useState(null);

  const {
    driver_on_pickup_place_at,
    finished_at,
    accepted_at,
    canceled_at,
    started_at,
    driver_name,
    driver_plate,
    isNew = false,
  } = travelReservation;

  const serviceState = (() => {
    if (!travelReservation) return "loading";
    if (canceled_at) return "canceled";
    else if (finished_at) return "finished";
    else if (driver_on_pickup_place_at) return "at_place";
    else if (accepted_at) return "accepted";
    else return "pending";
  })();

  const searchDriversnear = async () => {
    const clientCoords = JSON.parse(travelReservation.client_coords);
    const apiResponse = await getNearDrivers(
      driver.token,
      travelReservation.zone_code,
      clientCoords.latitude,
      clientCoords.longitude
    );
    setNearDrivers(apiResponse.length);
  };

  useEffect(() => {
    if (nearDrivers == null && isNew && serviceState == "pending") {
      searchDriversnear();
    }
  }, []);

  const refresh = (
    <Icon
      name="refresh"
      size={25}
      color="black"
      onPress={() => loadActiveService()}
    />
  );

  return (
    <View style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 25 }}>
      {(serviceState == "loading" || canceled) && (
        <Loading isVisible={true} hasText={false} />
      )}
      {serviceState == "pending" && (
        <PendingService
          nearDrivers={nearDrivers}
          cancelService={cancelService}
          loadingCancelTravelReservations={loadingCancelTravelReservations}
          travelReservation={travelReservation}
          refresh={refresh}
          canceled={canceled}
          finished={finished}
        />
      )}
      {(serviceState == "accepted" || serviceState == "at_place") && (
        <ServiceAccepted
          userLocationReducer={userLocationReducer}
          travelReservation={travelReservation}
          serviceState={serviceState}
          refresh={refresh}
        />
      )}
    </View>
  );
};
