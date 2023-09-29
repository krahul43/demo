import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SubmitButton as Button } from "../../../../../library/components/Button";
import moment from "../../../../../library/utils/moment";
import { capitalize } from "../../../../../library/utils/testFormat.util";
import { useDimensions, wp } from "../../../../../library/hooks/device.hooks";
import getTimes from "../../../../../library/hooks/request/drivers/travelReservation/getTimes";
import { useTheme } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { updateTravelReservation } from "../../../../../library/networking/API";
import Loading from "../../../../../library/components/Loading";
import ClientCard from "./ClientCard";
export default ({
  travelReservation,
  navigateToClientCoords,
  navigateToDestinationCoords,
  atClientPlace,
  atPlaceLoading,
  finishTravelService,
  finishLoading,
  isNew,
  driver,
  setTravelReservation,
  cancelService,
  canceled,
  loadingCancelTravelReservations,
  loadDriverInfoLoading,
  userLocationReducer,
}) => {
  const { portrait: p, hp } = useDimensions();
  const {
    colors: { darkBrand, success, primary, red },
  } = useTheme();
  const [times, setTimes] = useState([3, 5, 7, 10]);

  const [etaSelected, setEtaSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const updateEta = async (time) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("eta", time);
      setEtaSelected(time);
      await updateTravelReservation(
        driver.token,
        travelReservation.id,
        formData
      );
      setLoading(false);
      setTravelReservation({ ...travelReservation, eta: time });
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isNew)
      (async () => {
        const tms = await getTimes();
        setTimes(tms);
      })();
  }, []);

  const isLoading = atPlaceLoading || finishLoading;
  const View50P = ({ children }) => (
    <View style={{ marginBottom: 10, width: "100%" }}>{children}</View>
  );
  return (
    <ScrollView
      style={{ flex: 1, padding: 10 }}
      contentContainerStyle={{ paddingBottom: 25 }}
    >
      <View style={{ ...styles.titleView, borderBottomColor: primary }}>
        <Text style={styles.titleText}>Servicio {travelReservation.code}</Text>
        <Icon
          name="calendar"
          size={20}
          color={"grey"}
          style={{ marginRight: 5 }}
        />
        <Text style={{ color: "grey" }}>
          {isNew
            ? moment(travelReservation.accepted_at)
                .fromNow()
                .replace("segundos", "seg")
            : moment(travelReservation.accepted_at).format("L")}
        </Text>
      </View>
      {/*-------------INFORMACION DEL SERVICIO----------------------------- */}
      <View style={{ ...styles.section, borderColor: primary }}>
        <View style={{ ...styles.sectionHeader, backgroundColor: primary }}>
          <Text style={styles.sectionTitle}>Informacion del servicio</Text>
        </View>
        <View style={{ ...styles.sectionRowView, flex: 1 }}>
          {/* <Icon name="alpha-a-circle" size={20} /> */}
          <Text>
            <Text style={styles.boldText}>Origen: </Text>
            <Text style={styles.underlineText}>
              {capitalize(travelReservation.client_address)}
            </Text>
          </Text>
        </View>
        {travelReservation.destination_address != null && (
          <View style={{ ...styles.sectionRowView }}>
            {/* <Icon name="alpha-b-circle" size={20} /> */}
            <Text style={styles.boldText}>Destino:</Text>
            <Text style={styles.underlineText}>
              {capitalize(travelReservation.destination_address)}
            </Text>
          </View>
        )}
        {travelReservation.client_id == null &&
          travelReservation.eta != null &&
          isNew && (
            <View style={{ ...styles.sectionRowView }}>
              {/* <Icon name="alpha-b-circle" size={20} /> */}
              <Text style={styles.boldText}>Tiempo estimado:</Text>
              <Text style={styles.underlineText}>
                {travelReservation.eta
                  ? `${travelReservation.eta} min Aprox`
                  : "No determinado"}
              </Text>
            </View>
          )}
      </View>
      {/*-------------DETALLE DEL CLIENTE----------------------------- */}
      {/* <View style={{ ...styles.section, borderColor: primary }}>
        <View style={{ ...styles.sectionHeader, backgroundColor: primary }}>
          <Text style={styles.sectionTitle}>Detalles del cliente</Text>
        </View>
        <View style={styles.sectionRowView}>
          <Text>
            <Text Text style={styles.boldText}>
              Cliente:{" "}
            </Text>
            <Text style={styles.underlineText}>
              {capitalize(travelReservation.client_name)}
            </Text>
          </Text>
        </View>
        {typeof travelReservation.notes == "string" && (
          <>
            {travelReservation.notes.length > 0 && (
              <View style={styles.sectionRowView}>
                <Text>
                  <Text style={styles.boldText}>Nota: </Text>
                  <Text style={styles.underlineText}>
                    {travelReservation.notes
                      ? travelReservation.notes
                      : "Sin notas"}
                  </Text>
                </Text>
              </View>
            )}
          </>
        )}
      </View> */}

      {travelReservation.client_contact != null && (
        <View style={{ ...styles.section, borderColor: primary }}>
          <View style={{ ...styles.sectionHeadder, backgroundColor: primary }}>
            <Text style={styles.sectionTitle}>Detalle del cliente</Text>
          </View>
          {/* {console.log("driver info", travelReservation.driverInfo)} */}
          {loadDriverInfoLoading ||
          (!travelReservation.clientInfo &&
            !travelReservation.client_contact) ? (
            <ActivityIndicator
              color={primary}
              size="large"
              style={{ marginVertical: 12 }}
            />
          ) : (
            <>
              <ClientCard
                travelReservation={travelReservation}
                userLocationReducer={userLocationReducer}
                showDistance={true}
              />
              {typeof travelReservation.notes == "string" && (
                <>
                  {travelReservation.notes.length > 0 && (
                    <View style={styles.sectionRowView}>
                      <Text>
                        <Text style={styles.boldText}>Nota: </Text>
                        <Text style={styles.underlineText}>
                          {travelReservation.notes
                            ? travelReservation.notes
                            : "Sin notas"}
                        </Text>
                      </Text>
                    </View>
                  )}
                </>
              )}
            </>
          )}
        </View>
      )}

      {/*-------------DETALLE DEL SERVICIO----------------------------- */}
      {!isNew && (
        <View style={{ ...styles.section, borderColor: primary }}>
          <View style={{ ...styles.sectionHeader, backgroundColor: primary }}>
            <Text style={styles.sectionTitle}>Detallle del servicio</Text>
          </View>
          <View style={styles.serviceDetailView}>
            {travelReservation.created_at && (
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
                  {travelReservation.driver_on_pickup_place_at != null && (
                    <View
                      style={{
                        ...styles.detailIconLine,
                        backgroundColor: primary,
                      }}
                    />
                  )}
                </View>
                <View>
                  <View style={{ ...styles.sectionRowView, flex: 1 }}>
                    <Text>
                      <Text Text style={{ ...styles.boldText }}>
                        Registrado:{" "}
                      </Text>
                      <Text
                        style={{
                          ...styles.underlineText,
                          flex: 1,
                          marginLeft: 5,
                        }}
                      >
                        {capitalize(
                          moment(travelReservation.created_at).format("hh:mm A")
                        )}
                      </Text>
                    </Text>
                  </View>
                  {/* {travelReservation.driver_on_pickup_place_at != null && (
                  <View
                    style={{
                      ...styles.detailIconLine,
                      backgroundColor: "transparent",
                    }}
                  />
                )} */}
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
                  {travelReservation.finished_at != null && (
                    <View
                      style={{
                        ...styles.detailIconLine,
                        backgroundColor: primary,
                      }}
                    />
                  )}
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
                  {/* {travelReservation.finished_at != null && (
                    <View
                      style={{
                        ...styles.detailIconLine,
                        backgroundColor: "transparent",
                      }}
                    />
                  )} */}
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
      {/*-------------TIEMPO ESTIMADO DEL SERVICIO----------------------------- */}
      {isNew && travelReservation.eta == null && (
        <View style={{ ...styles.section, borderColor: primary }}>
          <View style={{ ...styles.sectionHeader, backgroundColor: primary }}>
            <Text style={styles.sectionTitle}>Tiempo de llegada (minutos)</Text>
          </View>
          <View style={styles.stateSteperView}>
            {times.map((t) => (
              <TouchableOpacity
                key={t}
                style={{
                  ...styles.stateStep,
                  backgroundColor: etaSelected == t ? primary : "#ccc",
                  width: 45,
                  height: 45,
                  marginHorizontal: 5,
                }}
                onPress={() => updateEta(t)}
              >
                <Text style={styles.numericText}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
      {isNew && (
        <>
          <View style={styles.buttonsContainer}>
            <Button
              onPress={() => cancelService()}
              icon="close"
              buttonStyle={{
                width: "60%",
                backgroundColor: darkBrand,
                marginTop: 18,
              }}
              labelStyle={{
                color: "#fff",
                fontSize: 14,
              }}
              loading={loadingCancelTravelReservations}
            >
              Cancelar
            </Button>
            {travelReservation.driver_on_pickup_place_at == null && (
              <>
                <Button
                  onPress={() => navigateToClientCoords()}
                  buttonStyle={{
                    width: "60%",
                    marginTop: 10,
                  }}
                  icon="subdirectory-arrow-right"
                  labelStyle={{
                    fontSize: 14,
                  }}
                  disabled={isLoading}
                >
                  Navegar
                </Button>

                <Button
                  onPress={() => atClientPlace()}
                  icon="crosshairs-gps"
                  buttonStyle={{
                    width: "60%",
                    marginTop: 10,
                    backgroundColor: success,
                  }}
                  labelStyle={{
                    color: "#fff",
                    fontSize: 14,
                  }}
                  disabled={isLoading}
                  loading={atPlaceLoading}
                >
                  En el lugar
                </Button>
              </>
            )}

            {travelReservation.driver_on_pickup_place_at != null &&
              travelReservation.finished_at == null && (
                <>
                  {travelReservation.destination_address != null && (
                    <Button
                      onPress={() => navigateToDestinationCoords()}
                      buttonStyle={{
                        width: "60%",
                        backgroundColor: darkBrand,
                        marginTop: 18,
                      }}
                      labelStyle={{
                        color: "#fff",
                        fontSize: 14,
                      }}
                      icon="crosshairs-gps"
                    >
                      Destino
                    </Button>
                  )}
                  <Button
                    onPress={() => finishTravelService()}
                    buttonStyle={{
                      width: "60%",
                      backgroundColor: success,
                      marginTop: 10,
                    }}
                    labelStyle={{
                      color: "#fff",
                      fontSize: 14,
                    }}
                    disabled={isLoading}
                    loading={finishLoading}
                    icon="check"
                  >
                    Finalizado
                  </Button>
                </>
              )}
          </View>
        </>
      )}
      <Loading isVisible={loading} hasText={false} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  buttonsContainer: {
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
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
    marginTop: 10,
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
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
  },
  section: {
    marginHorizontal: 5,
    marginTop: 20,
    borderWidth: 2,
  },
  sectionHeader: {
    padding: 5,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontStyle: "italic",
    fontSize: 18,
  },
  serviceDetailView: {
    padding: 5,
  },
  serviceDetailRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailIconLine: {
    width: 10,
    height: 12,
    alignSelf: "center",
    marginRight: 5,
    marginTop: -1,
    marginBottom: -1,
  },
  stateSteperView: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  stateStep: {
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionRowView: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  underlineText: {
    marginLeft: 5,
    fontSize: 15,
    // textDecorationLine: "underline",
  },
  boldText: {
    fontSize: 17,
    fontWeight: "bold",
  },
  numericText: {
    fontWeight: "bold",
    fontSize: 20,
    padding: 4,
  },
  serviceDetailIcon: {
    padding: 14,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
});

/**
 * 
 * <ScrollView style={{ flex: 1, padding: 10 }}>
      <Title style={styles.mainTitle}>Servicio TR{travelReservation.id}</Title>
      <View style={styles.infoContainer}>
        <View50P>
          <Text style={styles.title}>Código de servicio</Text>
          <Text style={styles.value}>{travelReservation.code}</Text>
        </View50P>
        <View50P>
          <Text style={styles.title}>Nombre del cliente</Text>
          <Text style={styles.value}>
            {capitalize(travelReservation.client_name)}
          </Text>
        </View50P>

        <View50P>
          <Text style={styles.title}>Recoger en</Text>
          <Text style={styles.value}>
            {capitalize(travelReservation.client_address)}
          </Text>
        </View50P>

        {travelReservation.destination_address && (
          <View50P>
            <Text style={styles.title}>Llevado a</Text>
            <Text style={styles.value}>
              {capitalize(travelReservation.destination_address)}
            </Text>
          </View50P>
        )}
        {/* {travelReservation.notes && (
          <View50P>
            <Text style={styles.title}>Notas</Text>
            <Text style={styles.value}>
              {capitalize(travelReservation.notes)}
            </Text>
          </View50P>
        )} 
        <View50P>
          <Text style={styles.title}>Registrado</Text>
          <Text style={styles.value}>
            {capitalize(moment(travelReservation.created_at).calendar())}
          </Text>
        </View50P>
        {travelReservation.driver_on_pickup_place_at && (
          <View50P>
            <Text style={styles.title}>Recogido</Text>
            <Text style={styles.value}>
              {capitalize(
                moment(travelReservation.driver_on_pickup_place_at).calendar()
              )}
            </Text>
          </View50P>
        )}
        {travelReservation.finished_at && (
          <View50P>
            <Text style={styles.title}>Finalizado</Text>
            <Text style={styles.value}>
              {capitalize(moment(travelReservation.finished_at).calendar())}
            </Text>
          </View50P>
        )}

        {isNew && (
          <View style={styles.buttonsContainer}>
            {travelReservation.driver_on_pickup_place_at == null && (
              <>
                <Button
                  onPress={() => navigateToClientCoords()}
                  buttonStyle={{
                    width: "60%",
                    marginTop: 10,
                  }}
                  icon="subdirectory-arrow-right"
                  labelStyle={{
                    fontSize: 14,
                  }}
                  disabled={isLoading}
                >
                  Recoger
                </Button>

                <Button
                  onPress={() => atClientPlace()}
                  icon="crosshairs-gps"
                  buttonStyle={{
                    width: "60%",
                    marginTop: 10,
                    backgroundColor: darkBrand,
                  }}
                  labelStyle={{
                    color: "#fff",
                    fontSize: 14,
                  }}
                  disabled={isLoading}
                  loading={atPlaceLoading}
                >
                  En el lugar
                </Button>
              </>
            )}

            {travelReservation.driver_on_pickup_place_at != null &&
              travelReservation.finished_at == null && (
                <>
                  <Button
                    onPress={() => navigateToDestinationCoords()}
                    buttonStyle={{
                      width: "60%",
                      backgroundColor: darkBrand,
                      marginTop: 18,
                    }}
                    labelStyle={{
                      color: "#fff",
                      fontSize: 14,
                    }}
                    icon="crosshairs-gps"
                  >
                    Destino
                  </Button>
                  <Button
                    onPress={() => finishTravelService()}
                    buttonStyle={{
                      width: "60%",
                      backgroundColor: success,
                      marginTop: 18,
                    }}
                    labelStyle={{
                      color: "#fff",
                      fontSize: 14,
                    }}
                    disabled={isLoading}
                    loading={finishLoading}
                    icon="check"
                  >
                    Finalizado
                  </Button>
                </>
              )}
          </View>
        )}
        {loadTravelReservationError && (
          <ErrorMessage>Error al cargar el servicio</ErrorMessage>
        )}
      </View>
    </ScrollView>
 */
