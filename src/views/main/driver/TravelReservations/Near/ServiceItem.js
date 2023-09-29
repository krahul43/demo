import React from "react";
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

import { RectButton } from "react-native-gesture-handler";
import { useTheme } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome5";
import MIcon from "react-native-vector-icons/MaterialCommunityIcons";

import moment from "../../../../../library/utils/moment";
import {
  capitalize,
  distanceWithMeasurement,
} from "../../../../../library/utils/testFormat.util";

export default (
  data,
  index,
  {
    confirmService,
    acceptService,
    isLoading,
    colors: { success, primary },
    activeService,
  }
) => {
  const onBtnClick = () => {
    if (isLoading() || activeService || data?.preRemove) return;
    if (!data.accepted) acceptService(data);
    else confirmService(data);
  };

  return (
    <RectButton style={styles.tile} onPress={() => onBtnClick()}>
      <Icon
        name="map-marker-alt"
        size={30}
        color={data.is_porter ? "#9575CD" : primary}
        style={styles.icon}
      />
      <View style={styles.info}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={styles.toText}>{capitalize(data.client_address)}</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          {data?.preRemove && !activeService ? (
            <Text style={styles.textSeparator}>
              Cancelado o asignado a otro conductor
            </Text>
          ) : (
            <View style={{ flexDirection: "column" }}>
              {data.notes != null && (
                <>
                  {data.notes.length > 0 && (
                    <Text style={styles.distanceText}>
                      {capitalize(data.notes)}
                    </Text>
                  )}
                </>
              )}
              <View
                style={{
                  flexDirection: "row",
                }}
              >
                <Text style={styles.priceText}>
                  {capitalize(moment(data.created_at).fromNow())}
                </Text>
                <Text style={styles.textSeparator}>~</Text>
                <Text style={styles.distanceText}>
                  {distanceWithMeasurement(data.distance)}
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
      <View style={styles.buttonContainer}>
        {!data?.preRemove && (
          <>
            {data.accepted ? (
              <TouchableOpacity
                style={[styles.rectButtonConfirm, { backgroundColor: success }]}
                // onPress={() => confirmService(data)}
                disabled={
                  isLoading() || activeService != null || data?.preRemove
                }
              >
                {isLoading() ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <MIcon name="check" size={22} color="#fff" />
                )}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.rectButtonAccept, { backgroundColor: primary }]}
                // onPress={() => acceptService(data)}
                disabled={
                  isLoading() || activeService != null || data?.preRemove
                }
              >
                <MIcon name="chevron-right" size={22} />
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </RectButton>
  );
};

const styles = StyleSheet.create({
  tile: {
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
  },
  icon: {
    paddingHorizontal: 12,
  },
  info: {
    flex: 0.7,
  },
  toText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  priceText: {
    color: "#5D6D7E",
  },
  textSeparator: {
    marginHorizontal: 5,
    color: "grey",
  },
  distanceText: {
    color: "grey",
  },
  buttonContainer: {
    flex: 0.3,
    alignItems: "center",
  },
  rectButtonAccept: {
    padding: 10,
    borderRadius: 8,
  },
  rectButtonConfirm: {
    padding: 10,
    borderRadius: 8,
  },
});
