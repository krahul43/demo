import React, { useRef, useState, useEffect } from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import { useTheme, List } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Loading from "../../../library/components/Loading";
import { BorderInput } from "../../components/Input";
import { SubmitButton, FlatButton } from "../../components/Button";
import { ErrorMessage } from "../../components/Alert";
import { capitalize } from "../../utils/testFormat.util";
import { Modalize } from "react-native-modalize";
import { useDispatch } from "react-redux";
import { useNetInfo } from "@react-native-community/netinfo";

import DirectionModalForm from "../../../library/forms/usuario/DirectionModalForm";
import InfoModal from "../../../library/components/InfoModal";
import AlertModal from "../../../library/components/AlertModal";

import { setInternetState } from "../../../library/redux/actions/internetAction";

import {
  getDirections,
  addDirection,
  removeDirection,
} from "../../networking/API";
import { useDimensions } from "../../hooks/device.hooks";

export default ({
  myDirection,
  setMyDirection,
  reservationLoading,
  onSubmit,
  destination = null,
  setDestination,
  //setAddress,
  driver,
  comments,
  setComments,
  activeService,
  onTapLocation,
  onTapFavorites,
  isFavorite,
  notConnected,
}) => {
  const { portrait: p, wp, hp } = useDimensions();

  const { isConnected } = useNetInfo();

  const {
    colors: { darkBrand, primary, red },
  } = useTheme();
  return (
    <View style={styles.paymentForm}>
      <View style={styles.rechargeStep}>
        <Text style={styles.stepText}>Donde estas ?</Text>
        <BorderInput
          containerStyle={{
            marginTop: 4,
          }}
          inputProps={{
            value: myDirection?.address,
            onChangeText: (text) =>
              setMyDirection({ ...myDirection, address: text }),
            multiline: true,
          }}
          trailing={
            <View style={styles.favoriteActionsRow}>
              <Icon
                name="crosshairs-gps"
                size={25}
                onPress={() =>
                  !isConnected ? notConnected() : onTapLocation(1)
                }
                color={primary}
                style={{ marginRight: 5 }}
              />
              {myDirection && (
                <Icon
                  name={
                    isFavorite(myDirection?.address) ? "star" : "star-outline"
                  }
                  size={25}
                  color={isFavorite(myDirection?.address) ? primary : darkBrand}
                  onPress={() =>
                    !isConnected ? notConnected() : onTapFavorites(1)
                  }
                />
              )}
            </View>
          }
        />
      </View>

      {destination && (
        <View style={styles.rechargeStep}>
          <Text style={styles.stepText}>Donde vas ?</Text>
          <BorderInput
            containerStyle={{
              marginTop: 4,
            }}
            inputProps={{
              placeholder: "Tu destino",
              value: destination?.address,
              onChangeText: (text) =>
                setDestination({ ...destination, address: text }),
            }}
            leading={
              <Icon
                name="close"
                size={35}
                onPress={() => {
                  setDestination(null);
                }}
                color={red}
              />
            }
            trailing={
              <View style={styles.favoriteActionsRow}>
                <Icon
                  name="crosshairs-gps"
                  size={25}
                  onPress={() =>
                    !isConnected ? notConnected() : onTapLocation(2)
                  }
                  color={"black"}
                  style={{ marginRight: 5 }}
                />
                <Icon
                  name={
                    isFavorite(destination?.address) ? "star" : "star-outline"
                  }
                  size={25}
                  onPress={() =>
                    !isConnected ? notConnected() : onTapFavorites(2)
                  }
                  color={isFavorite(destination?.address) ? primary : darkBrand}
                />
              </View>
            }
          />
        </View>
      )}
      <View style={styles.rechargeStep}>
        <Text style={styles.stepText}>Comentario</Text>
        <BorderInput
          containerStyle={{
            marginTop: 4,
          }}
          inputProps={{
            value: comments,
            onChangeText: (v) => setComments(v),
            placeholder: "Apartamento 204",
          }}
          trailing={
            <View style={styles.favoriteActionsRow}>
              <Icon
                name="text"
                size={35}
                color={darkBrand}
                style={{ marginRight: 5 }}
              />
            </View>
          }
        />
        {!destination && (
          <SubmitButton
            buttonStyle={{
              marginTop: hp(2),
              backgroundColor: darkBrand,
              zIndex: 1,
            }}
            onPress={() => (!isConnected ? notConnected() : onTapLocation(2))}
            labelStyle={{ color: "#fff" }}
            icon="crosshairs-gps"
          >
            Destino
          </SubmitButton>
        )}
        <SubmitButton
          buttonStyle={{ marginTop: hp(2), zIndex: 1 }}
          loading={reservationLoading}
          disabled={reservationLoading || activeService}
          onPress={() => (!isConnected ? notConnected() : onSubmit())}
          icon="check"
        >
          Reservar
        </SubmitButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
    paddingBottom: 10,
    flex: 1,
  },
  title: {
    textAlign: "center",
    marginVertical: 10,
  },
  paymentForm: {
    marginVertical: 10,
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
});
