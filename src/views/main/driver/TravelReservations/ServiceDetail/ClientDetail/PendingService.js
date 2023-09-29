import React, { useRef, useEffect, useState } from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import SimpleMapView from "../../../../../../library/components/SimpleMapView";
import RadarAnimation from "../../../../../../library/components/Lottie/Radar";
import { ProgressBar } from "react-native-paper";
import {
  H3,
  Subheading,
} from "../../../../../../library/components/Typography";
import { Modalize } from "react-native-modalize";
import { SubmitButton as Button } from "../../../../../../library/components/Button";
import moment, {
  minutesAndSeconds,
} from "../../../../../../library/utils/moment";
import { useTheme } from "react-native-paper";
import { useInterval } from "../../../../../../library/hooks/IntervalHook";

export default ({
  nearDrivers = null,
  cancelService,
  loadingCancelTravelReservations,
  travelReservation,
  refresh,
  canceled,
  finished,
}) => {
  // modalize component
  const LookingForDriverModal = () => {
    const {
      colors: { darkBrand, success, primary, red },
    } = useTheme();
    const modalizeRef = useRef(null);

    useEffect(() => {
      modalizeRef.current.open();
    }, []);

    const { code } = travelReservation;

    // progress component
    const WaitTimeProgressBar = () => {
      const { created_at } = travelReservation;
      const [progressConstants, setProgessConstanst] = useState({});
      const {
        color: pColor = success,
        value: pValue = 0,
        minutes: pMinutes = "0:00",
      } = progressConstants;

      const calculateProgress = () => {
        const ago = moment().diff(moment(created_at), "s");
        const agoMinutes = minutesAndSeconds(
          moment().diff(moment(created_at), "s")
        );
        const barColor =
          ago <= 250
            ? success
            : ago > 250 && ago <= 450
            ? primary
            : ago > 450
            ? red
            : "gray";

        const progressValue = ago / 650;

        setProgessConstanst({
          value: ago,
          color: barColor,
          minutes: agoMinutes,
          value: progressValue,
        });
      };

      useInterval(() => {
        calculateProgress();
      }, 1000);

      return (
        <View style={styles.progressBar}>
          <Text>Tiempo de espera {pMinutes}</Text>
          <ProgressBar
            style={{ marginTop: 8 }}
            progress={pValue}
            color={pColor}
          />
        </View>
      );
    };

    return (
      <Modalize
        ref={modalizeRef}
        withOverlay={false}
        dragToss={false}
        modalStyle={{ zIndex: 3, ...styles.lookingForDriverModalContainer }}
        modalHeight={200}
        onClosed={() => setTimeout(() => modalizeRef.current.open(), 2000)}
      >
        <H3>Buscando Conductor</H3>
        <View style={styles.refresh}>{refresh}</View>

        <Subheading style={{ marginBottom: 10, color: "gray" }}>
          {nearDrivers || "Buscando"} en la zona
        </Subheading>

        <Image
          source={require("../../../../../../../assets/taxi-image.png")}
          style={styles.taxiImage}
          resizeMode={"contain"}
        />

        <WaitTimeProgressBar />

        <View style={styles.cancelButtonContainer}>
          <Button
            onPress={() => {
              cancelService();
            }}
            icon="close"
            buttonStyle={{
              width: "60%",
              backgroundColor: darkBrand,
            }}
            labelStyle={{
              color: "#fff",
              fontSize: 14,
            }}
            loading={loadingCancelTravelReservations}
          >
            {loadingCancelTravelReservations ? "Cancelando" : "Cancelar"}
          </Button>
        </View>
      </Modalize>
    );
  };

  return (
    <View style={styles.container}>
      {!loadingCancelTravelReservations && !canceled && !finished && (
        <>
          <View style={styles.radarContainer}>
            <RadarAnimation />
          </View>
          <SimpleMapView />
          <LookingForDriverModal />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  radarContainer: {
    flex: 1,
    position: "absolute",
    height: "100%",
    width: "100%",
    backgroundColor: "grey",
    opacity: 0.5,
    zIndex: 2,
    alignItems: "center",
  },
  lookingForDriverModalContainer: {
    paddingTop: 20,
    paddingHorizontal: 20,
    position: "relative",
  },
  refresh: {
    position: "absolute",
    right: 0,
    top: -5,
    zIndex: 5,
  },
  taxiImage: {
    position: "absolute",
    right: 0,
    top: -15,
    width: 120,
  },
  cancelButtonContainer: {
    flex: 1,
    paddingVertical: 20,
  },
  progressBar: {
    alignSelf: "flex-start",
    width: "53%",
  },
});
