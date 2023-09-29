//*COMPONENTE CONTENEDOR DE LAS VISTAS CUANDO EL USUARIO SE LOGEA
import React from "react";
import { useTheme } from "react-native-paper";
import { View, StyleSheet, StatusBar, Image, SafeAreaView } from "react-native";
import { useSelector } from "react-redux";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FIcon from "react-native-vector-icons/FontAwesome";
import SwitchSelector from "react-native-switch-selector";
import { useDimensions, wp } from "../hooks/device.hooks";
import { useToggleDriverAvailability } from "../hooks/users/driversComunicationRegistry.hooks";

//*menu: CUANDO ESTA EN TRUE EL BACK BUTTON DE LA VISTA SE REEMPLAZA POR EL MENU QUE ABRE LA VISTA LATERAL
export default function AppContainerMap({
  children,
  navigation,
  backButton = false,
  backButtonFunction = null,
  drawerMenu = true,
  availability = false,
  backRoute = null,
}) {
  const { driver } = useSelector(({ driverReducer }) => driverReducer);
  const { isNew: activeService } = useSelector(
    ({ activeServiceReducer }) => activeServiceReducer || {}
  );
  const {
    user: { available },
  } = driver || { user: {} };
  const toggleDriverAvailability = useToggleDriverAvailability();
  const {
    colors: { primary, success, red },
  } = useTheme();

  const { portrait: p, hp } = useDimensions();

  const switchOptions = [
    {
      label: "Off",
      value: 0,
      activeColor: red,
      customIcon: !available ? (
        <Icon name="taxi" color="#fff" style={{ marginRight: 4 }} />
      ) : null,
    },
    {
      label: "On",
      value: 1,
      activeColor: success,
      customIcon: available ? (
        <Icon name="taxi" color="#fff" style={{ marginRight: 4 }} />
      ) : null,
    },
  ];
  return (
    <>
      <SafeAreaView style={styles.safeAreaTop} />
      <StatusBar barStyle="dark-content" backgroundColor={primary} />
      {/*//?VIEW CONTAINER*/}
      <SafeAreaView style={styles.safeAreaBottom}>
        {/*//?HEADER CONTAINER*/}
        <View style={[styles.headerContainer, { height: p ? hp(7) : hp(12) }]}>
          {/*//?ACTION BUTTON CONTAINER*/}
          <View style={styles.actionButton}>
            {backButton ? (
              <Icon
                name="chevron-left"
                size={30}
                color="#fff"
                onPress={() => {
                  if (backRoute) {
                    try {
                      console.log(
                        navigation.dangerouslyGetParent().state.index
                      );
                      // navigation.goBack();
                    } catch (error) {
                      navigation.navigate(backRoute);
                    }
                  } else {
                    if (backButtonFunction) {
                      backButtonFunction();
                    } else {
                      navigation.goBack();
                    }
                  }
                }}
              />
            ) : (
              drawerMenu && (
                <FIcon
                  name="bars"
                  size={25}
                  color="#fff"
                  onPress={() => navigation.openDrawer()}
                />
              )
            )}
          </View>
          {/*//?LOGO CONTAINER*/}
          <View style={[styles.centerHeaderContent]}>
            {availability && (
              <SwitchSelector
                options={switchOptions}
                onPress={(value) => toggleDriverAvailability(Boolean(value))}
                height={20}
                style={{ width: "30%" }}
                backgroundColor={"gray"}
                initial={available ? 1 : 0}
                value={available ? 1 : 0}
                disabled={activeService != null}
              />
            )}

            <Image
              source={require("../../../assets/TAXIZONE.png")}
              style={{
                width: p ? wp(20) : wp(15),
                marginRight: p ? wp(10) : hp(10),
                marginLeft: p ? wp(6) : hp(6),
              }}
              resizeMode="contain"
            />
          </View>
        </View>
        {/*//?BORDER CONTAINER*/}
        <View style={[styles.headerBorder, { height: p ? hp(4) : wp(4) }]} />
        {/*//?FORM CONTAINER*/}
        <View style={styles.content}>{children}</View>
        {/*//?FOOTER CONTAINER*/}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeAreaTop: {
    flex: 0,
    backgroundColor: "#171717",
  },
  safeAreaBottom: {
    flex: 1,
    backgroundColor: "transparent",
    alignItems: "center",
  },
  headerContainer: {
    backgroundColor: "#000",
    flexDirection: "row",
  },
  centerHeaderContent: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    flex: 1,
    height: "100%",
  },
  actionButton: {
    width: "20%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    zIndex: 2,
  },
  headerBorder: {
    backgroundColor: "#F2B215",
    zIndex: 1,
    width: "100%",
  },
  content: {
    width: "97%",
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    flex: 1,
    marginBottom: 10,
    marginTop: -15,
    zIndex: 4,
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
