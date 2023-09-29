import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import StarRating from "react-native-star-rating";
import { useTheme, Avatar } from "react-native-paper";
import { Title } from "../../../../../library/components/Typography";
import { distance as getDistance } from "../../../../../library/hooks/location.hooks";
import { distanceWithMeasurement } from "../../../../../library/utils/testFormat.util";

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
  const [rateEvaluation, setRateEvaluation] = useState(0);
  const distance = travelReservation?.client_coords
    ? getDistance(
        JSON.parse(travelReservation?.client_coords || "{}"),
        userLocationReducer?.coords
      )
    : 0;

  useEffect(() => {
    if (requestListener) {
      requestCallback(rateEvaluation);
    }
  }, [requestListener]);

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
            {evaluate ? "¿Desea calificar al usuario?" : "Servicio Finalizado"}
          </Title>
        )}
        <Avatar.Image
          size={70}
          source={
            travelReservation?.clientInfo?.photo
              ? { uri: travelReservation?.clientInfo?.photo }
              : require("../../../../../../assets/no-profile.png")
          }
        />
      </View>
      <Text style={{ ...styles.boldText, textAlign: "center", ...spacing }}>
        {`${travelReservation?.client_name}`}
      </Text>

      {!evaluate &&
        showDistance &&
        Object.keys(userLocationReducer?.coords || {}) > 0 && (
          <Text style={{ color: "gray", textAlign: "center" }}>
            {distanceWithMeasurement(distance)}
            {travelReservation?.eta != null &&
              ` ~ ${travelReservation?.eta} min (aprox)`}
          </Text>
        )}

      <View style={{ padding: 10, alignItems: "center" }}>
        {travelReservation?.clientInfo?.starts_rate != null && (
          <>
            {!evaluate ? (
              <StarRating
                maxStars={5}
                rating={travelReservation?.clientInfo?.starts_rate || 5}
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
          </>
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
