import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  Linking,
  TouchableOpacity,
} from "react-native";
import { useTheme, IconButton } from "react-native-paper";
import { removeActiveServiceAction } from "../../../library/redux/actions/porter/activeServicesActions";
import moment from "../../../library/utils/moment";
import { capitalize } from "../../../library/utils/testFormat.util";
import InfoModal from "../../../library/components/InfoModal";
import { useSelector, useDispatch } from "react-redux";
import Plate from "../../components/Plate";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default ({ cancelService }) => {
  const {
    colors: { primary, red },
  } = useTheme();

  const [showInfo, setShowInfo] = useState(false);
  const { data: porterActiveServices = [] } = useSelector(
    ({ porterActiveServicesReducer }) => porterActiveServicesReducer
  );

  const colors = {
    pendingColor: primary,
    takenColor: "#884EA0",
    atPlaceColor: "#1ABC9C",
    finishedColor: "#3498DB",
    canceledColor: red,
  };

  const {
    pendingColor,
    takenColor,
    atPlaceColor,
    finishedColor,
    canceledColor,
  } = colors;

  const badgeColor = ({
    finished_at,
    driver_on_pickup_place_at,
    accepted_at,
    canceled_at,
  }) =>
    canceled_at
      ? canceledColor
      : finished_at
      ? finishedColor
      : driver_on_pickup_place_at
      ? atPlaceColor
      : accepted_at
      ? takenColor
      : pendingColor;

  const callerApp = (phone_number) =>
    Linking.openURL(`tel:${phone_number}`.replace("+57", ""));

  return (
    <>
      <View style={styles.activesTitleContainer}>
        <View style={[styles.halfLine, { marginRight: 5 }]} />
        <Text style={styles.activesTitle}>
          Reservas activas {porterActiveServices.length}
        </Text>
        <Icon
          name="information"
          size={22}
          style={{ marginLeft: 5 }}
          onPress={() => setShowInfo(true)}
        />
        <View style={[styles.halfLine, { marginLeft: 5 }]} />
      </View>
      {console.log({ porterActiveServices })}
      {porterActiveServices.length > 0 &&
        porterActiveServices.map((item) => (
          <View style={styles.activeRow} key={item.id}>
            <View style={[styles.activeContainer, { borderColor: primary }]}>
              <View
                style={[
                  styles.activeLabelContainer,
                  { backgroundColor: "white" },
                ]}
              >
                <Text
                  style={[
                    styles.activeLabelText,
                    { color: !item.canceled_at ? "black" : "grey" },
                  ]}
                >
                  {item.code}{" "}
                  {item.canceled_at != null
                    ? "- Servicio cancelado"
                    : item.finished_at != null
                    ? "- Servicio finalizado"
                    : null}
                </Text>
              </View>
              <View style={styles.activeDetails}>
                <View
                  style={[
                    styles.stateView,
                    {
                      backgroundColor: badgeColor(item),
                      alignSelf: "flex-start",
                    },
                  ]}
                />
                {typeof item.notes == "string" && (
                  <>
                    {item.notes.length > 0 && (
                      <Text style={styles.notesText}>
                        {capitalize(item.notes)}
                      </Text>
                    )}
                  </>
                )}
                {item.client_name != null && (
                  <Text style={styles.clientText}>
                    {capitalize(item.client_name)}
                  </Text>
                )}

                {item?.driver_phone_number != null && (
                  <TouchableOpacity
                    onPress={() => callerApp(item?.driver_phone_number)}
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderRadius: 100,
                    }}
                  >
                    <Text style={{ color: "gray" }}>
                      <Icon name="taxi" size={14} />{" "}
                      <Icon name="phone" size={10} style={{ marginLeft: -5 }} />{" "}
                      {item?.driver_phone_number}
                    </Text>
                  </TouchableOpacity>
                )}

                {item.created_at != null &&
                  item.eta == null &&
                  item.driver_on_pickup_place_at == null && (
                    <Text style={styles.dateText}>
                      {capitalize(moment(item.created_at).fromNow())}
                    </Text>
                  )}
                {item.driver_on_pickup_place_at == null && item.eta != null && (
                  <>
                    <Text style={styles.dateText}>
                      {capitalize(
                        `Asignado ${moment(item.accepted)
                          .fromNow()
                          .replace("segundos", "seg")}`
                      )}
                    </Text>
                    <Text
                      style={[
                        styles.dateText,
                        { fontStyle: "italic", color: "#757575" },
                      ]}
                    >
                      <Icon name="clock" style={{ marginTop: 5 }} /> Estimado{" "}
                      {item.eta} min
                    </Text>
                  </>
                )}
                {item.eta != null &&
                  item.driver_on_pickup_place_at != null &&
                  item.finished_at == null && (
                    <>
                      <Text style={styles.dateText}>
                        {capitalize(`Tu taxi ha llegado a recogerte`)}
                      </Text>
                      {item?.driver_on_pickup_place_at != null && (
                        <Text
                          style={[
                            styles.dateText,
                            { fontStyle: "italic", color: "#757575" },
                          ]}
                        >
                          {capitalize(
                            `${
                              moment().fromNow()
                              // item.driver_on_pickup_place_at
                            }`.replace("segundos", "seg")
                          )}
                        </Text>
                      )}
                    </>
                  )}
              </View>
              <View style={styles.activeActions}>
                {item.driver_plate != null && (
                  <Plate>{item.driver_plate?.toUpperCase()}</Plate>
                )}
                {item.loading ? (
                  <ActivityIndicator
                    size="small"
                    color={primary}
                    style={styles.cancelActive}
                  />
                ) : (
                  !item.canceled &&
                  !item.finished_at && (
                    <IconButton
                      icon="close"
                      color={red}
                      style={styles.cancelActive}
                      onPress={() => cancelService(item)}
                      disabled={item.loading}
                    />
                  )
                )}
              </View>
            </View>
          </View>
        ))}
      <InfoModal
        show={showInfo}
        setShow={setShowInfo}
        title={"Estado de reserva por color"}
        message={
          "El color de la barra en las reservaciones activas indica el estado del servicio:"
        }
        children={
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <View
                style={[styles.stateView, { backgroundColor: pendingColor }]}
              />
              <Text style={styles.infoText}>En espera de conductor</Text>
            </View>
            <View style={styles.infoRow}>
              <View
                style={[styles.stateView, { backgroundColor: takenColor }]}
              />
              <Text style={styles.infoText}>
                Asignado, conductor en camino a su ubicación
              </Text>
            </View>
            <View style={styles.infoRow}>
              <View
                style={[styles.stateView, { backgroundColor: atPlaceColor }]}
              />
              <Text style={styles.infoText}>
                Conductor en tu ubicación o en camino a destino
              </Text>
            </View>
            <View style={styles.infoRow}>
              <View
                style={[styles.stateView, { backgroundColor: finishedColor }]}
              />
              <Text style={styles.infoText}>Servicio finalizado</Text>
            </View>
            <View style={styles.infoRow}>
              <View
                style={[styles.stateView, { backgroundColor: canceledColor }]}
              />
              <Text style={styles.infoText}>Cancelado</Text>
            </View>
          </View>
        }
        declineAction={false}
        confirmAction={() => setShowInfo(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 0,
    //flexGrow:1,
    marginHorizontal: 15,
    paddingBottom: 10,
  },
  title: {
    textAlign: "center",
    marginTop: 5,
    marginBottom: 0,
  },
  paymentForm: {
    marginTop: -5,
  },
  rechargeStep: {
    marginVertical: 10,
  },
  stepText: {
    color: "grey",
    fontSize: 16,
    fontStyle: "italic",
  },
  row: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalizeHeaderView: {
    marginHorizontal: 15,
    paddingVertical: 15,
    borderBottomColor: "#aaa",
    borderBottomWidth: 1,
    borderRadius: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalizeHeaderText: {
    fontSize: 16,
    color: "#aaa",
    fontStyle: "italic",
  },
  modalizerButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "black",
    borderRadius: 200,
  },
  modalizerButtonText: {
    color: "white",
  },
  favoriteActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  activesTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
  },
  halfLine: {
    height: 1,
    backgroundColor: "gray",
    flex: 1,
  },
  activesTitle: {
    fontStyle: "italic",
    fontSize: 18,
  },
  activeRow: {
    paddingVertical: 12,
  },
  activeContainer: {
    borderWidth: 1,
    borderRadius: 4,
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: 12,
    paddingBottom: 10,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  activeLabelContainer: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    top: -17,
    left: 10,
    paddingHorizontal: 5,
    paddingVertical: 0,
    zIndex: 50,
  },
  activeLabelText: {
    fontStyle: "italic",
    fontWeight: "bold",
    fontSize: 16,
    paddingTop: 4,
  },
  activeDetails: {
    flex: 1,
  },
  activeActions: {
    alignItems: "flex-end",
  },
  stateView: {
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderWidth: 1,
    borderRadius: 100,
    marginTop: 5,
  },
  notesText: {
    color: "#5D6D7E",
    fontStyle: "italic",
    fontSize: 15,
  },
  clientText: {
    color: "black",
    fontStyle: "italic",
    fontSize: 15,
  },
  dateText: {
    color: "gray",
    fontStyle: "italic",
    fontSize: 13,
  },
  cancelActive: {
    padding: 2,
    marginHorizontal: 0,
    marginTop: 10,
    // backgroundColor: "red",
    // borderRadius: 100,
  },
  infoContainer: {
    marginTop: 5,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    //justifyContent:'center'
  },
  infoText: {
    fontStyle: "italic",
    fontSize: 15,
    marginLeft: 10,
  },
});
