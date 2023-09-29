import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import StarRating from "react-native-star-rating";
import { useTheme, Avatar } from "react-native-paper";
import { distance as getDistance } from "../../../../../library/hooks/location.hooks";
import { distanceWithMeasurement } from "../../../../../library/utils/testFormat.util";
import moment from "../../../../../library/utils/moment";
import { useInterval } from "../../../../../library/hooks/IntervalHook";
import { Title } from "../../../../../library/components/Typography";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Plate from "../../../../../library/components/Plate";

export default ({
  evaluate = false,
  travelReservation = null,
  userLocationReducer,
  showDistance = false,
  requestListener = false,
  requestCallback,
}) => {
  const {
    colors: { primary },
  } = useTheme();
  const [aprox, setAprox] = useState(null);
  const [rateEvaluation, setRateEvaluation] = useState(0);
  const distance = travelReservation?.driverInfo?.last_location
    ? getDistance(
        userLocationReducer?.coords,
        JSON.parse(travelReservation?.driverInfo?.last_location || "{}")
      )
    : 0;

  useEffect(() => {
    if (requestListener) {
      console.log("requestCallback");
      requestCallback(rateEvaluation);
    }
  }, [requestListener]);

  useEffect(() => {
    if (travelReservation?.eta) setAproximateTime();
  }, [travelReservation]);

  const showContact =
    travelReservation.isNew &&
    !evaluate &&
    travelReservation?.driverInfo?.phone_number;

  const callerApp = () =>
    Linking.openURL(
      `tel:${travelReservation?.driverInfo?.phone_number}`.replace("+57", "")
    );

  const setAproximateTime = () =>
    setAprox(
      moment(travelReservation.accepted_at)
        .add(travelReservation?.eta, "minutes")
        .diff(moment(), "minutes")
    );

  useInterval(
    () => {
      setAproximateTime();
    },
    showDistance && travelReservation?.eta != null ? 20000 : null
  );

  const spacing = evaluate
    ? {
        marginVertical: 10,
      }
    : {};
  return (
    <>
      <View
        style={{
          padding: 13,
          alignItems: "center",
          // flex: 1,
          paddingBottom: 0,
        }}
      >
        {evaluate && (
          <Title
            style={{
              marginBottom: 18,
              textAlign: "center",
              fontSize: 18,
              marginTop: -15,
            }}
          >
            ¿Desea calificar el servicio?
          </Title>
        )}
        <Avatar.Image
          size={70}
          source={
            travelReservation?.driverInfo?.photo
              ? { uri: travelReservation?.driverInfo?.photo }
              : require("../../../../../../assets/no-profile.png")
          }
        />
      </View>
      <Text style={{ ...styles.boldText, textAlign: "center", ...spacing }}>
        {`${travelReservation?.driver_name}`}
      </Text>

      {showContact && !evaluate && (
        <TouchableOpacity
          onPress={() => callerApp()}
          style={{
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 100,
          }}
        >
          <Text style={{ color: "gray", textAlign: "center" }}>
            <Icon name="phone" size={14} />{" "}
            {travelReservation?.driverInfo?.phone_number}
          </Text>
        </TouchableOpacity>
      )}

      <View style={{ alignItems: "center" }}>
        <Plate>{travelReservation?.driverInfo?.plate?.toUpperCase()}</Plate>
      </View>

      {!evaluate && showDistance && aprox != null && (
        <Text style={{ color: "gray", textAlign: "center" }}>
          {distanceWithMeasurement(distance)}
          {travelReservation?.eta != null && aprox <= 0
            ? ` ~ Llegando...`
            : ` ~ ${aprox} min (aprox)`}
        </Text>
      )}

      <View style={{ padding: 10, alignItems: "center" }}>
        {!evaluate ? (
          <StarRating
            maxStars={5}
            rating={travelReservation?.driverInfo?.starts_rate || 5}
            containerStyle={{ width: "65%" }}
            starSize={24}
            fullStarColor={primary}
            disabled={true}
            halfStarEnabled={true}
          />
        ) : (
          <StarRating
            maxStars={5}
            rating={rateEvaluation}
            containerStyle={{ width: "65%", zIndex: 100 }}
            starSize={24}
            fullStarColor={primary}
            halfStarEnabled={true}
            selectedStar={(v) => setRateEvaluation(v)}
          />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  boldText: {
    fontSize: 17,
    fontWeight: "bold",
  },
});
