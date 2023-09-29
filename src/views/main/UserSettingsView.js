import React, { useState } from "react";
import { StyleSheet, View, Text, Linking } from "react-native";
import { List, Colors } from "react-native-paper";
import { useDispatch } from "react-redux";
import { useNetInfo } from "@react-native-community/netinfo";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import AppContainerMap from "../../library/components/AppContainerMap";

import { signOut } from "../../library/hooks/User.hooks";
import { setUserAWS } from "../../library/redux/actions/Auth.action";
import { setInternetState } from "../../library/redux/actions/internetAction";
import { deleteDriverApiAction } from "../../library/redux/actions/taxista/driverAction";

const dataTest = [
  {
    title: "Mi perfil",
    icon: "account",
    onTap: (navigation) => navigation.navigate("Profile", { notChange: null }),
  },
  // {
  //   title: "Idioma",
  //   icon: "web",
  //   subtitle: "Español",
  //   onTap: (navigation) => {},
  // },
  {
    title: "Viajes Realizados",
    icon: "car-sports",
    onTap: (navigation) => navigation.navigate("Trips"),
  },
  // {
  //   title: "Historial de recargas",
  //   icon: "wallet",
  //   onTap: (navigation) => navigation.navigate("Refills"),
  // },
  // {
  //   title: "Mis direcciones",
  //   icon: "book",
  //   onTap: (navigation) => navigation.navigate("Directions"),
  // },
  {
    title: "Términos y Condiciones",
    icon: "file-document",
    onTap: async () =>
      await Linking.openURL("https://taxizone.com.co/terminosdeuso.html"),
  },
  // {
  //   title: "Acerca de TaxiZone",
  //   icon: "alert-circle-outline",
  //   onTap: (navigation) => {},
  // },
  {
    title: "Cerrar Sesión",
    icon: "location-exit",
  },
];

export default function UserSettings({ navigation }) {
  const dispatch = useDispatch();
  const { isConnected } = useNetInfo();

  const [settings, setSettings] = useState(dataTest);

  const chevronText = (props, text) =>
    text ? (
      <View {...props} style={styles.detailsContainer}>
        <Text style={styles.detailsText}>{text}</Text>
        <Icon name="chevron-right" size={30} color="grey" />
      </View>
    ) : (
      <Icon
        {...props}
        size={30}
        name="chevron-right"
        style={{ alignSelf: "center" }}
      />
    );

  const notConnected = () => dispatch(setInternetState(false));

  const lastItem = (index) => index == settings.length - 1;

  const exit = async () => {
    //! CERRAR SESION
    await signOut();
    dispatch(deleteDriverApiAction());
    dispatch(setUserAWS(null));
  };

  return (
    <>
      <AppContainerMap
        navigation={navigation}
        backButton={true}
        drawerMenu={false}
      >
        {settings.map((item, index) => {
          return (
            <List.Item
              key={index}
              style={[
                styles.item,
                { backgroundColor: lastItem(index) ? Colors.grey300 : null },
              ]}
              onPress={() =>
                lastItem(index)
                  ? exit()
                  : !isConnected
                  ? notConnected()
                  : item.onTap(navigation)
              }
              title={item.title}
              left={(props) => (
                <Icon
                  {...props}
                  size={30}
                  name={item.icon}
                  style={{ alignSelf: "center" }}
                />
              )}
              right={(props) =>
                lastItem(index) ? null : chevronText(props, item.subtitle)
              }
            />
          );
        })}
      </AppContainerMap>
    </>
  );
}

const styles = StyleSheet.create({
  item: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 15,
  },
  detailsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailsText: {
    color: "grey",
    paddingRight: 8,
  },
});
