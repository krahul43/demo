import React from "react";
import { StyleSheet, View, Text, Linking } from "react-native";
import Constants from "expo-constants";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { useDispatch, useSelector } from "react-redux";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Avatar } from "react-native-paper";

import { setUserAWS } from "../../library/redux/actions/Auth.action";
import { useSignOut } from "../../library/hooks/User.hooks";
import { capitalize } from "../../library/utils/testFormat.util";
import { useDimensions } from "../../library/hooks/device.hooks";
import { deleteDriverApiAction } from "../../library/redux/actions/taxista/driverAction";

const Separator = ({ margin }) => {
  return (
    <View
      style={{
        marginVertical: margin,
        borderBottomColor: "white",
        borderBottomWidth: 1,
      }}
    />
  );
};

export const SizedBox = ({ wdt = null, hgt = null }) => {
  return wdt ? (
    <View style={{ width: wdt }} />
  ) : (
    <View style={{ height: hgt }} />
  );
};

export function DrawerContent(props) {
  const { driver } = useSelector(({ driverReducer }) => driverReducer);
  const dispatch = useDispatch();
  const signOut = useSignOut();
  const { portrait: p } = useDimensions();
  const { type: userType = "driver" } = driver?.user || {};
  const isDriver = userType == "driver";

  const profilePhoto = driver?.user?.photo;
  //*FUNCION PARA DESLOGEARSE
  const SignOut = async () => {
    await signOut();
    dispatch(deleteDriverApiAction());
    dispatch(setUserAWS(null));
  };

  const { version } = Constants.manifest;
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={[styles.drawerContent, { flex: p ? 1 : null }]}
    >
      <View>
        <View style={styles.drawerHeader}>
          <Avatar.Image
            size={70}
            source={
              profilePhoto
                ? { uri: profilePhoto }
                : require("../../../assets/no-profile.png")
            }
          />
          <SizedBox wdt={10} />
          <View style={styles.userDataContainer}>
            <Text style={styles.title}>
              {capitalize(
                `${driver?.user.first_name} ${driver?.user.last_name}`
              )}
            </Text>
            <Text style={styles.label}>{driver?.user.phone_number}</Text>
          </View>
        </View>
        <Separator margin={15} />
        <View>
          <DrawerItem
            label={isDriver ? "Viajes realizados" : "Servicios reservados"}
            labelStyle={styles.label}
            icon={() => (
              <Icon
                size={28}
                style={{ marginRight: -10 }}
                color="white"
                name="car-sports"
              />
            )}
            onPress={() => props.navigation.navigate("Trips")}
          />
          <DrawerItem
            label="Configuracion"
            labelStyle={styles.label}
            icon={() => (
              <Icon
                size={28}
                style={{ marginRight: -10 }}
                color="white"
                name="account-cog"
              />
            )}
            onPress={() => props.navigation.navigate("Settings")}
          />
          {isDriver && (
            <DrawerItem
              label="Mi Billetera"
              labelStyle={styles.label}
              icon={() => (
                <Icon
                  size={28}
                  style={{ marginRight: -10 }}
                  color="white"
                  name="wallet"
                />
              )}
              onPress={() => props.navigation.navigate("Wallet")}
            />
          )}
          <DrawerItem
            label="Terminos y condiciones"
            labelStyle={styles.label}
            icon={() => (
              <Icon
                size={28}
                style={{ marginRight: -10 }}
                color="white"
                name="file-document"
              />
            )}
            onPress={async () =>
              await Linking.openURL(
                "https://taxizone.com.co/terminosdeuso.html"
              )
            }
          />
        </View>
      </View>

      <View>
        <DrawerItem
          label="Cerrar sesion"
          labelStyle={styles.label}
          icon={() => (
            <Icon
              size={28}
              style={{ marginRight: -10 }}
              color="white"
              name="location-exit"
            />
          )}
          onPress={() => SignOut()}
        />
        <Separator margin={10} />
        <DrawerItem label={`Versión ${version}`} labelStyle={styles.label} />
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    justifyContent: "space-between",
  },
  drawerHeader: {
    marginTop: 40,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  userDataContainer: {
    flex: 1,
  },
  title: {
    fontWeight: "bold",
    color: "white",
    fontSize: 16,
  },
  label: {
    color: "white",
    fontSize: 15,
  },
});
