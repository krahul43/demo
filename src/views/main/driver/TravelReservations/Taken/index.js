import React, { useState, useEffect } from "react";
import { FlatList, StyleSheet, View, Text, Alert } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useSelector, useDispatch } from "react-redux";

import AppContainerMap from "../../../../../library/components/AppContainerMap";
import { Title, Caption } from "../../../../../library/components/Typography";

import { useDimensions } from "../../../../../library/hooks/device.hooks";
import useLoadTakenTravelReservations from "../../../../../library/hooks/request/drivers/travelReservation/useLoadTakenTravelReservations.hooks";
import { setActiveServiceAction } from "../../../../../library/redux/actions/activeService.action";
import { capitalize } from "../../../../../library/utils/testFormat.util";
import moment from "../../../../../library/utils/moment";

export default function TripsMade({ navigation, route }) {
  const dispatch = useDispatch();
  const {
    takenTravelReservations,
    loading: takenTravelReservationsLoading,
  } = useSelector(
    ({ takenTravelReservationsReducer }) => takenTravelReservationsReducer
  );
  const {
    driver: {
      user: { type: userType },
    },
  } = useSelector(({ driverReducer }) => driverReducer);
  const setActiveService = (t) => dispatch(setActiveServiceAction(t));
  const isDriver = userType === "driver";
  const isPorter = userType === "porter";
  const {
    getTakenTravelReservations: loadTakenTravelReservationsAsync,
    setTakenTravelReservations,
  } = useLoadTakenTravelReservations();
  const { portrait: p } = useDimensions();

  const [page, setPage] = useState(1);
  const [refresh, setRefresh] = useState(false);

  const LoadTakenTravelReservations = async (p) => {
    try {
      setRefresh(!refresh);
      if (p) await loadTakenTravelReservationsAsync(p);
      else await loadTakenTravelReservationsAsync(page);
      setRefresh(!refresh);
    } catch (error) {
      console.error(error);
      Alert.alert("Error al cargar los viajes realizados");
    }
  };

  useEffect(() => {
    setTakenTravelReservations([]);
    LoadTakenTravelReservations();
  }, []);

  const listItem = (item) => {
    return (
      <RectButton
        style={styles.tile}
        onPress={() => {
          // setActiveService({ ...item, isNew: false });
          navigation.navigate("ServiceDetail", {
            back: true,
            backRoute: "Trips",
            service: { ...item, isNew: false },
          });
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.fromText}>{capitalize(item.client_address)}</Text>
          <Text style={styles.toText}>{item.code}</Text>
          <View style={styles.detailsSeparator} />
          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <Icon
                name="calendar"
                size={20}
                color="grey"
                style={{ marginRight: 10 }}
              />
              <Text style={{ color: "grey" }}>
                {capitalize(moment(item.created_at).format("L hh:mm A"))}
              </Text>
            </View>
          </View>
        </View>
      </RectButton>
    );
  };
  return (
    <AppContainerMap
      navigation={navigation}
      backRoute={isDriver ? "Services" : isPorter ? "PorterHome" : "UserHome"}
      backButton={true}
      drawerMenu={false}
    >
      <Title style={styles.title}>
        {isDriver ? "Viajes Realizados" : "Servicios reservados"}
      </Title>
      <FlatList
        extraData={refresh}
        contentContainerStyle={styles.listContainer}
        keyExtractor={(item) => item.id.toString()}
        data={takenTravelReservations}
        renderItem={({ item }) => listItem(item)}
        ItemSeparatorComponent={() => (
          <View style={{ height: 5, width: "100%", backgroundColor: "#000" }} />
        )}
        refreshing={takenTravelReservationsLoading}
        onEndReached={() => {
          if (!takenTravelReservationsLoading) {
            LoadTakenTravelReservations(page + 1);
            setPage(page + 1);
          }
        }}
        onRefresh={() => {
          setTakenTravelReservations([]);
          LoadTakenTravelReservations(1);
          setPage(1);
          setRefresh(!refresh);
        }}
        ListFooterComponent={
          <>
            {!takenTravelReservations.length &&
              !takenTravelReservationsLoading && (
                <View style={styles.notResultsContainer}>
                  <Caption style={styles.notResultsText}>
                    No hay viajes registrados.
                  </Caption>
                </View>
              )}
          </>
        }
      />
    </AppContainerMap>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    marginTop: 10,
    paddingBottom: 110,
    alignItems: "center",
  },
  title: {
    marginVertical: 10,
    textAlign: "center",
  },
  tile: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    width: "95%",
    backgroundColor: "#fff",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  detailsSeparator: {
    width: "20%",
    marginVertical: 10,
    borderColor: "#F2B215",
    borderWidth: 1,
  },
  detailsContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  fromText: {
    fontSize: 16,
    marginBottom: 8,
  },
  toText: {
    fontSize: 14,
  },
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
});
