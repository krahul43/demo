import React, { useRef, useEffect, useState } from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import { hp, wp } from "../../../../../../library/hooks/device.hooks";
import { H3, Paragraph } from "../../../../../../library/components/Typography";
import DriverCard from "../DriverCard";

export default ({
  userLocationReducer,
  travelReservation,
  serviceState,
  refresh,
}) => {
  const atPlace = serviceState == "at_place";
  return (
    <View style={styles.container}>
      <View style={styles.refresh}>{refresh}</View>
      <View style={styles.titleContainer}>
        {atPlace ? (
          <H3 style={styles.title}>En el lugar</H3>
        ) : (
          <H3 style={styles.title}>Servicio asignado</H3>
        )}
        {atPlace ? (
          <Paragraph>Han llegado a recogerle</Paragraph>
        ) : (
          <Paragraph>Conductor en camino</Paragraph>
        )}
      </View>
      <View style={styles.driverCard}>
        <DriverCard
          travelReservation={travelReservation}
          userLocationReducer={userLocationReducer}
          showDistance={!atPlace}
        />
      </View>
      <Image
        source={
          atPlace
            ? require("../../../../../../../assets/at-place.png")
            : require("../../../../../../../assets/service-taken.png")
        }
        style={styles.serviceTakenImage}
        resizeMode={"contain"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  title: {
    color: "#000",
    fontWeight: "bold",
  },
  refresh: {
    position: "absolute",
    right: 10,
    top: 10,
    zIndex: 5,
  },
  titleContainer: {
    alignSelf: "flex-end",
    zIndex: 2,
    margin: 35,
  },
  serviceTakenImage: {
    position: "absolute",
    right: -wp(15),
    top: hp(1),
    height: hp(80),
  },
  driverCard: {
    zIndex: 2,
    padding: 20,
    borderRadius: 8,
    backgroundColor: "#fff",
    width: "70%",
    position: "absolute",
    right: wp(4),
    top: hp(50),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
});
