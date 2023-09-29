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

import DriverCard from "./DriverCard";
import {
  ErrorMessage,
  InfoMessage,
} from "../../../../../library/components/Alert";
import { SubmitButton as Button } from "../../../../../library/components/Button";

import { getNearDrivers } from "../../../../../library/networking/API";
import { useDimensions, wp } from "../../../../../library/hooks/device.hooks";
import moment from "../../../../../library/utils/moment";
import { capitalize } from "../../../../../library/utils/testFormat.util";

export default ({
  travelReservation,
  loadingCancelTravelReservations,
  errorCancelTravelReservations,
  cancelService,
  canceled,
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
  const [nearDrivers, setNearDrivers] = useState("(...)");

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

  const canbeCanceled = () => {
    if (finished_at) return false;
    else return true;
  };

  const searchDriversnear = async () => {
    const clientCoords = JSON.parse(travelReservation.client_coords);
    const apiResponse = await getNearDrivers(
      driver.token,
      travelReservation.zone_code,
      clientCoords.latitude,
      clientCoords.longitude
    );
    setNearDrivers(`(${apiResponse.length} alrededor)`);
    // console.log("NEAR", apiResponse);
  };

  //searchDriversnear();

  useEffect(() => {
    if (nearDrivers == "(...)" && isNew) {
      searchDriversnear();
    }
  }, [travelReservation]);

  return (
    <ScrollView
      style={{ flex: 1, padding: 10 }}
      contentContainerStyle={{ paddingBottom: 25 }}
    >
      <View style={{ ...styles.titleView, borderBottomColor: primary }}>
        <Text style={styles.titleText}>Servicio {travelReservation.code}</Text>
        <View
          style={{
            ...styles.serviceIndicatorView,
            backgroundColor: canceled_at
              ? "#EF5350"
              : finished_at
              ? primary
              : "#AED581",
          }}
        >
          <Text style={styles.serviceIndicatorText}>
            {canceled_at ? "Cancelado" : finished_at ? "Finalizado" : "Activo"}
          </Text>
        </View>
      </View>
      {!canceled_at && (
        <View style={{ ...styles.section, borderColor: primary }}>
          <View style={{ ...styles.sectionHeadder, backgroundColor: primary }}>
            <Text style={styles.sectionTitle}>Estado</Text>
            {isNew && (
              <Icon
                name="refresh"
                size={25}
                color="black"
                onPress={() => loadActiveService()}
              />
            )}
          </View>
          <View style={styles.stateBodyView}>
            <View style={styles.stateSteperView}>
              <View
                style={{
                  ...styles.stateStep,
                  backgroundColor: accepted_at ? primary : "#ccc",
                }}
              >
                <Icon name="map-marker" size={25} />
              </View>
              <View
                style={{
                  ...styles.stateLine,
                  flex: 0.2,
                  backgroundColor: driver_on_pickup_place_at ? primary : "#ccc",
                }}
              />
              <View
                style={{
                  ...styles.stateStep,
                  backgroundColor: driver_on_pickup_place_at ? primary : "#ccc",
                }}
              >
                <Icon name="car-connected" size={25} />
              </View>
              <View
                style={{
                  ...styles.stateLine,
                  flex: 0.2,
                  backgroundColor: finished_at ? primary : "#ccc",
                }}
              />
              <View
                style={{
                  ...styles.stateStep,
                  backgroundColor: finished_at ? primary : "#ccc",
                }}
              >
                <Icon name="home-map-marker" size={25} />
              </View>
            </View>
            <View style={{ ...styles.sectionRowView, flex: 1 }}>
              {!travelReservation.accepted_at ? (
                <Text>
                  <Text style={{ ...styles.boldText }}>En espera: </Text>
                  <Text style={{ ...styles.underlineText, flex: 1 }}>
                    Esperando que un conductor acepte el servicio{" "}
                    {isNew && nearDrivers}
                  </Text>
                </Text>
              ) : (
                <Text>
                  <Text style={{ ...styles.boldText }}>
                    {canceled_at
                      ? "Cancelado: "
                      : finished_at
                      ? "En lugar de destino: "
                      : driver_on_pickup_place_at
                      ? "En lugar de origen: "
                      : accepted_at
                      ? "Asignado: "
                      : ""}
                  </Text>
                  <Text style={{ ...styles.underlineText, flex: 1 }}>
                    {canceled_at
                      ? "El servicio fue cancelado"
                      : finished_at
                      ? "servicio finalizado"
                      : driver_on_pickup_place_at
                      ? "el condutor ha llegado a recogerle"
                      : accepted_at
                      ? "Se le ha asignado un conductor"
                      : ""}
                  </Text>
                </Text>
              )}
            </View>
          </View>
        </View>
      )}
      <View style={{ ...styles.section, borderColor: primary }}>
        <View style={{ ...styles.sectionHeadder, backgroundColor: primary }}>
          <Text style={styles.sectionTitle}>Detalle del servicio</Text>
        </View>
        <View style={{ ...styles.sectionRowView, flex: 1 }}>
          <Text>
            <Text style={{ ...styles.boldText }}>Origen: </Text>
            <Text style={{ ...styles.underlineText, flex: 1 }}>
              {capitalize(travelReservation.client_address)}
            </Text>
          </Text>
        </View>
        {travelReservation.destination_address != null && (
          <View style={{ ...styles.sectionRowView, flex: 1 }}>
            <Text>
              <Text style={{ ...styles.boldText }}>Destino: </Text>
              <Text style={{ ...styles.underlineText, flex: 1 }}>
                {capitalize(travelReservation.destination_address)}
              </Text>
            </Text>
          </View>
        )}
        {travelReservation.notes != null && (
          <>
            {travelReservation.notes.length > 0 && (
              <View style={{ ...styles.sectionRowView, flex: 1 }}>
                <Text>
                  <Text style={{ ...styles.boldText }}>Notas: </Text>
                  <Text style={styles.underlineText}>
                    {capitalize(travelReservation.notes)}
                  </Text>
                </Text>
              </View>
            )}
          </>
        )}
      </View>
      {travelReservation.driver_id != null && (
        <View style={{ ...styles.section, borderColor: primary }}>
          <View style={{ ...styles.sectionHeadder, backgroundColor: primary }}>
            <Text style={styles.sectionTitle}>Detalle del conductor</Text>
          </View>
          {/* {console.log("driver info", travelReservation.driverInfo)} */}
          {loadDriverInfoLoading || !travelReservation.driverInfo ? (
            <ActivityIndicator
              color={primary}
              size="large"
              style={{ marginVertical: 12 }}
            />
          ) : (
            <DriverCard
              travelReservation={travelReservation}
              userLocationReducer={userLocationReducer}
              showDistance={travelReservation.isNew}
            />
          )}
        </View>
      )}

      {!isNew && canceled_at == null && (
        <View style={{ ...styles.section, borderColor: primary }}>
          <View style={{ ...styles.sectionHeadder, backgroundColor: primary }}>
            <Text style={styles.sectionTitle}>Registro del servicio</Text>
          </View>
          <View style={styles.serviceDetailView}>
            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <Icon
                name="calendar"
                size={20}
                color={"grey"}
                style={{ marginRight: 5, marginTop: 3 }}
              />
              <Text style={{ color: "grey" }}>
                {isNew
                  ? moment(travelReservation.accepted_at)
                      .fromNow()
                      .replace("segundos", "seg")
                  : moment(travelReservation.accepted_at).format("L")}
              </Text>
            </View>
            {travelReservation.created_at != null && (
              <View style={styles.serviceDetailRow}>
                <View>
                  <View
                    style={{
                      ...styles.serviceDetailIcon,
                      backgroundColor: primary,
                      marginRight: 5,
                      flex: 0.1,
                    }}
                  >
                    <Icon name="map-marker" size={25} />
                  </View>
                  <View
                    style={{
                      ...styles.detailIconLine,
                      backgroundColor: primary,
                    }}
                  />
                </View>
                <View>
                  <View style={{ ...styles.sectionRowView, flex: 1 }}>
                    <Text>
                      <Text Text style={{ ...styles.boldText }}>
                        Registrado:{" "}
                      </Text>
                      <Text style={{ ...styles.underlineText, flex: 1 }}>
                        {capitalize(
                          moment(travelReservation.created_at).format("hh:mm A")
                        )}
                      </Text>
                    </Text>
                  </View>
                  <View
                    style={{
                      ...styles.detailIconLine,
                      backgroundColor: "transparent",
                    }}
                  />
                </View>
              </View>
            )}

            {travelReservation.driver_on_pickup_place_at != null && (
              <View style={styles.serviceDetailRow}>
                <View>
                  <View
                    style={{
                      ...styles.serviceDetailIcon,
                      backgroundColor: primary,
                      marginRight: 5,
                      flex: 0.1,
                    }}
                  >
                    <Icon name="car-connected" size={25} />
                  </View>
                  <View
                    style={{
                      ...styles.detailIconLine,
                      backgroundColor: primary,
                    }}
                  />
                </View>
                <View>
                  <View style={{ ...styles.sectionRowView, flex: 1 }}>
                    <Text>
                      <Text Text style={{ ...styles.boldText }}>
                        Recogido:{" "}
                      </Text>
                      <Text style={{ ...styles.underlineText, flex: 1 }}>
                        {capitalize(
                          moment(
                            travelReservation.driver_on_pickup_place_at
                          ).format("hh:mm A")
                        )}
                      </Text>
                    </Text>
                  </View>
                  <View
                    style={{
                      ...styles.detailIconLine,
                      backgroundColor: "transparent",
                    }}
                  />
                </View>
              </View>
            )}
            {travelReservation.finished_at != null && (
              <View style={styles.serviceDetailRow}>
                <View>
                  <View
                    style={{
                      ...styles.serviceDetailIcon,
                      backgroundColor: primary,
                      marginRight: 5,
                      flex: 0.1,
                    }}
                  >
                    <Icon name="home-map-marker" size={25} />
                  </View>
                </View>
                <View>
                  <View style={{ ...styles.sectionRowView, flex: 1 }}>
                    <Text>
                      <Text Text style={{ ...styles.boldText }}>
                        Finalizado:{" "}
                      </Text>
                      <Text style={{ ...styles.underlineText, flex: 1 }}>
                        {capitalize(
                          moment(travelReservation.finished_at).format(
                            "hh:mm A"
                          )
                        )}
                      </Text>
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>
      )}

      <View style={{ marginTop: 30 }}>
        {isNew && (
          <>
            {canbeCanceled() && (
              <Button
                onPress={() => {
                  //setShowCancelConfirmation(true)
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
                Cancelar
              </Button>
            )}
          </>
        )}
        {errorCancelTravelReservations && (
          <ErrorMessage>Error al cancelar el servicio</ErrorMessage>
        )}
        {loadTravelReservationError && (
          <ErrorMessage>Error al cargar el servicio</ErrorMessage>
        )}
        {canceled && !loadingCancelTravelReservations && (
          <InfoMessage reload={canceled}>Servicio cancelado</InfoMessage>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  infoContainer: {
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 15,
    paddingBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  value: {
    color: "grey",
    marginTop: 3,
  },
  mainTitle: {
    marginVertical: 10,
    textAlign: "center",
  },
  titleView: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 5,
    paddingVertical: 5,
    borderBottomWidth: 2,
  },
  titleText: {
    fontSize: 22,
    fontWeight: "bold",
    flex: 1,
  },
  section: {
    marginHorizontal: 5,
    marginTop: 20,
    borderWidth: 2,
  },
  sectionHeadder: {
    padding: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontWeight: "bold",
    fontStyle: "italic",
    fontSize: 18,
  },
  stateSteperView: {
    paddingTop: 20,
    paddingHorizontal: 5,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  stateStep: {
    padding: 16,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  stateLine: {
    height: 5,
  },
  stateDescription: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  stateDescriptionText: {
    fontSize: 17,
  },
  sectionRowView: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  underlineText: {
    marginLeft: 5,
    fontSize: 16,
    // textDecorationLine: "underline",
  },
  boldText: {
    fontSize: 17,
    fontWeight: "bold",
  },
  serviceIndicatorView: {
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  serviceIndicatorText: {
    fontStyle: "italic",
    fontWeight: "bold",
    color: "white",
  },
  serviceDetailIcon: {
    padding: 14,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  detailIconLine: {
    width: 10,
    height: 12,
    alignSelf: "center",
    marginRight: 5,
    marginTop: -1,
    marginBottom: -1,
  },
  serviceDetailView: {
    padding: 5,
  },
  serviceDetailRow: {
    flexDirection: "row",
    alignItems: "center",
  },
});

/*
<Title style={styles.mainTitle}>Servicio TR{travelReservation.id}</Title>
      <View style={styles.infoContainer}>
        <View50P>
          <Text style={styles.title}>Código de servicio</Text>
          <Text style={styles.value}>{travelReservation.code}</Text>
        </View50P>
        <View50P>
          <Text style={styles.title}>Recoger en</Text>
          <Text style={styles.value}>
            {capitalize(travelReservation.client_address)}
          </Text>
        </View50P>
        {travelReservation.destination_address && (
          <View50P>
            <Text style={styles.title}>Destino</Text>
            <Text style={styles.value}>
              {capitalize(travelReservation.destination_address)}
            </Text>
          </View50P>
        )}
        {travelReservation.notes != null && (
          <>
            {travelReservation.notes.length != 0 && (
              <View50P>
                <Text style={styles.title}>Notas</Text>
                <Text style={styles.value}>
                  {capitalize(travelReservation.notes)} a
                </Text>
              </View50P>
            )}
          </>
        )}
        <View50P>
          <Text style={styles.title}>Registrado</Text>
          <Text style={styles.value}>
            {capitalize(moment(travelReservation.created_at).calendar())}
          </Text>
        </View50P>
        {travelReservation.accepted_at && (
          <View50P>
            <Text style={styles.title}>Conductor asignado</Text>
            <Text style={styles.value}>
              {capitalize(moment(travelReservation.accepted_at).calendar())}
            </Text>
          </View50P>
        )}
        {travelReservation.driver_on_pickup_place_at && (
          <View50P>
            <Text style={styles.title}>Conductor llego a recogerle</Text>
            <Text style={styles.value}>
              {capitalize(
                moment(travelReservation.driver_on_pickup_place_at).calendar()
              )}
            </Text>
          </View50P>
        )}
        {serviceState && (
          <View50P>
            <Text style={styles.title}>Estado</Text>
            <Text style={styles.value}>{capitalize(serviceState)}</Text>
          </View50P>
        )}
        <View style={{ marginTop: 30 }}>
          {isNew && (
            <>
              {canbeCanceled() && (
                <Button
                  onPress={() => cancelService()}
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
                  Cancelar
                </Button>
              )}
            </>
          )}
          {errorCancelTravelReservations && (
            <ErrorMessage>Error al cancelar el servicio</ErrorMessage>
          )}
          {loadTravelReservationError && (
            <ErrorMessage>Error al cargar el servicio</ErrorMessage>
          )}
          {canceled && !loadingCancelTravelReservations && (
            <InfoMessage reload={canceled}>Servicio cancelado</InfoMessage>
          )}
        </View>
      </View>
*/
