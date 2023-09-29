import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { List } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { useNetInfo } from "@react-native-community/netinfo";
import { useTheme } from "react-native-paper";

import AlertModal from "../../library/components/AlertModal";
import InfoModal from "../../library/components/InfoModal";
import AppContainerMap from "../../library/components/AppContainerMap";
import { Headline, Caption } from "../../library/components/Typography";
import ImageContainer from "../../library/components/ImageContainer";
import Loading from "../../library/components/Loading";

import { updateInfo } from "../../library/networking/API";
import { updateDriverUserAction } from "../../library/redux/actions/taxista/driverAction";
import { setInternetState } from "../../library/redux/actions/internetAction";
import { capitalize } from "../../library/utils/testFormat.util";

const OPTIONS = [
  {
    title: "Número de teléfono",
    //subtitle:'318*****23',
    icon: "cellphone",
    onTap: (navigation, type) => navigation.navigate("ChangePhone"),
  },
  {
    title: "Información personal",
    //subtitle:'das****@g**',
    icon: "account",
    onTap: (navigation, type) => {
      const dest = type == "driver" ? "RegisterDriver" : "RegisterUser";
      navigation.navigate(dest, { update: "info" });
    },
  },
  {
    title: "Cambiar mi contraseña",
    icon: "lock",
    onTap: (navigation, type) => navigation.navigate("ChangePassword"),
  },
  {
    title: "Información de mi vehiculo",
    icon: "car-sports",
    onTap: (setShowAlert) => setShowAlert(true),
  },
  // {
  //   title:'Eliminar mi cuenta',
  //   icon:'account-remove',
  //   onTap:(navigation) => {}
  // },
];

export default function UserProfile({ navigation, route }) {
  const { notChange } = route.params;
  const { driver } = useSelector(({ driverReducer }) => driverReducer);
  const dispatch = useDispatch();
  const { isConnected } = useNetInfo();
  const {
    colors: { primary },
  } = useTheme();

  const [profileOptions, setProfileOptions] = useState(OPTIONS);
  const [profileImage, setProfileImage] = useState(driver?.user?.photo);
  const [pictureLoading, setPictureLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [alertIcon, setAlertIcon] = useState("");

  const chevronText = (props, text) =>
    text ? (
      <View {...props} style={styles.detailContainer}>
        <Text style={styles.detailText}>{text}</Text>
        <Icon name="pencil" size={30} color="#ccc" />
      </View>
    ) : (
      <Icon
        {...props}
        size={30}
        name="pencil"
        color="#ccc"
        style={{ alignSelf: "center" }}
      />
    );

  const changePicture = async () => {
    //! FUNCION QUE CAMBIA LA IMAGEN EN LA BASE DE DATOS Y EN EL REDUCER
    setPictureLoading(true);
    let infoData = new FormData();
    infoData.append("picture", profileImage);
    try {
      const { photo } = await updateInfo(driver?.token, infoData);
      const updateData = { ...driver, user: { ...driver.user, photo: photo } };
      dispatch(updateDriverUserAction(updateData));
      setPictureLoading(false);
      setAlertText("Información Actualizada");
      setAlertIcon("check");
      setShowAlert(true);
    } catch (error) {
      setAlertText(
        "Hubo un error al cargar el la informacion, por favor verifica tu conexion a internet"
      );
      setAlertIcon("information");
      setShowAlert(true);
      return;
    }
  };

  const notConnected = () => dispatch(setInternetState(false));

  const goToDocuments = () => {
    //! REDIRIGE A LOS DOCUMENTOS
    setShowInfo(false);
    navigation.navigate("RegisterDriver", { update: "documents" });
  };

  const closeAlert = () => setShowAlert(false);

  useEffect(() => {
    //! CIERRA LA ADVERTENCIA DESPUES DE UN TIEMPO
    if (showAlert) {
      const listener = setTimeout(() => setShowAlert(false), 1000);

      return () => clearTimeout(listener);
    }
  }, [showAlert]);

  useEffect(() => {
    //! DETECTA EL CAMBIO DE IMAGEN PARA MOSTRAR EL MENSAJE
    if (profileImage != null && profileImage != driver?.user?.photo) {
      !isConnected ? notConnected() : changePicture();
    }
  }, [profileImage]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setRefresh(!refresh);
      if (notChange != null) {
        if (notChange == true) {
          setAlertText("No se realizaron cambios");
          setAlertIcon("close");
          setShowAlert(true);
        } else {
          setAlertText("Información Actualizada");
          setAlertIcon("check");
          setShowAlert(true);
        }
      }
    });

    return unsubscribe;
  });

  useEffect(() => {
    //! ELIMINA LA OPCION DE LOS DOCUMENTOS SI EL USUARIO ES UN CLIENTE
    if (driver?.user?.type == "client") {
      setProfileOptions(profileOptions.slice(0, 3));
    }
  }, []);

  return (
    <>
      <AppContainerMap
        navigation={navigation}
        backButton={true}
        drawerMenu={false}
      >
        <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
          <View style={styles.listContainer}>
            <View style={styles.imageContainer}>
              <View>
                <ImageContainer
                  imageStyles={{
                    ...styles.profileImg,
                    width: 100,
                    height: 100,
                    borderColor: primary,
                  }}
                  imageProps={{ resizeMode: "cover" }} //? para que el redondeado tome efecto es nevesario colocar en vocer
                  defaultImage={require("../../../assets/no-profile.png")}
                  selectedImage={profileImage}
                  setSelectedImage={setProfileImage}
                  caption={null}
                />
                <View style={styles.cameraIconView}>
                  <Icon
                    size={18}
                    color="white"
                    name="pencil"
                  />
                </View>
              </View>
            </View>
            <View style={[{ alignItems: "flex-start" }]}>
              <Headline>
                {capitalize(
                  `${driver?.user?.first_name} ${driver?.user?.last_name}`
                )}
              </Headline>
            </View>
            <View style={[{ alignItems: "flex-start" }]}>
              <Caption>{capitalize(driver?.user?.phone_number)}</Caption>
            </View>
          </View>

          <View style={styles.optionsContainer}>
            {profileOptions.map((item, index) => (
              <List.Item
                key={index}
                style={[styles.item]}
                titleStyle={{
                  color: "black",
                }}
                onPress={() =>
                  !isConnected
                    ? notConnected()
                    : index != 3
                    ? item.onTap(navigation, driver.user.type)
                    : item.onTap(setShowInfo)
                }
                title={item.title}
                left={(props) => (
                  <Icon
                    {...props}
                    size={30}
                    name={item.icon}
                    style={{ alignSelf: "center" }}
                    color={"black"}
                  />
                )}
                right={(props) => chevronText(props, item.subtitle)}
              />
            ))}
          </View>
        </ScrollView>
        <Loading hasText={false} isVisible={pictureLoading} />
        <InfoModal
          show={showInfo}
          setShow={setShowInfo}
          title={"Advertencia"}
          message={
            "Si modifica un documento en la siguiente vista la session se cerrara cuando intente volver"
          }
          declineAction={true}
          confirmAction={goToDocuments}
        />
      </AppContainerMap>
      <AlertModal
        isVisible={showAlert}
        text={alertText}
        icon={alertIcon}
        closeFunction={closeAlert}
      />
    </>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 15,
    backgroundColor: "white",
  },
  imageContainer: {
    alignItems: "center",
    paddingBottom: 10,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  profileImg: {
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "red",
  },
  cameraIconView: {
    position: "absolute",
    bottom: 5,
    right: -5,
    padding: 5,
    backgroundColor: "grey",
    borderRadius: 50,
  },
  optionsContainer: {
    marginTop: 10,
    backgroundColor: "white",
  },
  item: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 15,
  },
  detailContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailText: {
    color: "#ccc",
    paddingRight: 8,
  },
});
