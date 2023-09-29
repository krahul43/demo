import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useTheme } from "react-native-paper";
import {
  View,
  StyleSheet,
  StatusBar,
  Image,
  ScrollView,
  SafeAreaView,
  BackHandler,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import InfoModal from "./InfoModal";

import { signOut } from "../hooks/User.hooks";
import { useDimensions, wp } from "../hooks/device.hooks";
import { deleteDriverApiAction } from "../redux/actions/taxista/driverAction";

export default function AppContainerForm({
  children,
  backButton = true,
  navigation,
  documentsView = false,
  updateDocumentType = null,
  preventExit = false,
  changeCounter,
}) {
  const { portrait: p, hp } = useDimensions();
  const dispatch = useDispatch();
  const {
    colors: { primary },
  } = useTheme();

  const [showInfo, setShowInfo] = useState(false);

  const navigateBack = async () => {
    //! FUNCION DEL BOTON DE REGRESO
    if (preventExit && updateDocumentType == null) {
      //! REGISTRO / CORRECCION
      setShowInfo(true);
    } else if (preventExit && changeCounter > 0) {
      //! EDICION DE DOCUMENTOS (SI CAMBIA UN DOCUMENTO)
      await signOut();
      dispatch(deleteDriverApiAction());
    } else {
      navigation.goBack();
    }
  };

  const exit = async () => {
    //! SALIR DEL FORMULARIO DE DOCUMENTOS
    await signOut();
    dispatch(deleteDriverApiAction());
    try {
      navigation.navigate("Login");
    } catch (error) {
      return true;
    }
  };

  useEffect(() => {
    //! CAPTURA DEL BOTON FISICO DE REGRESO
    const onBackPress = () => {
      if (!showInfo) {
        navigateBack();
      }
      return true;
    };
    BackHandler.addEventListener("hardwareBackPress", onBackPress);

    return () => BackHandler.removeEventListener("hardwareBackPress");
  }, [changeCounter]);

  return (
    <>
      {/*//? STATUS BAR */}
      <SafeAreaView style={styles.safeAreaTop} />
      <StatusBar barStyle="dark-content" backgroundColor={primary} />
      {/*//?BODY CONTAINER*/}
      <SafeAreaView style={styles.safeAreaBottom}>
        <ScrollView>
          {/*//?HEADER CONTAINER*/}
          <View
            style={[
              styles.headerContainer,
              { height: p ? hp(16.5) : hp(19.5) },
            ]}
          >
            {backButton && (
              <View style={styles.actionButton}>
                <Icon
                  name="chevron-left"
                  size={35}
                  color="#fff"
                  onPress={() => navigateBack()}
                />
              </View>
            )}
            <View style={[styles.centerHeaderContent]}>
              <Image
                source={require("../../../assets/TAXIZONE2.png")}
                style={{ width: p ? wp(45) : wp(20) }}
                resizeMode="contain"
              />
            </View>
          </View>
          <View style={[styles.headerBorder, { height: p ? hp(6) : hp(6) }]} />
          {/*//?FORM CONTAINER*/}
          {!documentsView ? (
            <View style={[styles.formContainer, { top: -hp(3) }]}>
              {children}
            </View>
          ) : (
            <View>{children}</View>
          )}
        </ScrollView>
        <InfoModal
          show={showInfo}
          setShow={setShowInfo}
          title={"Aviso de salida"}
          message={
            "si cancela la operacion el proceso no se completara exitosamente, desea salir de todos modos ?"
          }
          declineAction={true}
          confirmAction={exit}
        />
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
  },
  headerContainer: {
    backgroundColor: "#000",
    flexDirection: "row",
  },
  centerHeaderContent: {
    justifyContent: "center",
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
  },
  formContainer: {
    width: "95%",
    paddingHorizontal: 22,
    paddingVertical: 16,
    borderRadius: 10,
    alignSelf: "center",
    backgroundColor: "white",
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
