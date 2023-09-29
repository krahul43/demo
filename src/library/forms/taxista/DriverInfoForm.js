import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNetInfo } from "@react-native-community/netinfo";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import { TextInput as Input } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useTheme } from "react-native-paper";
import _ from "lodash";

import { TextInput } from "../../components/Input";
import { H2 } from "../../components/Typography";
import { ErrorMessage } from "../../components/Alert";
import { SubmitButton } from "../../components/Button";
import ZonesModal from "../../components/ZonesModal";
import Loading from "../../components/Loading";

import { updateInfo } from "../../networking/API";
import { useDimensions } from "../../hooks/device.hooks";
import { setInternetState } from "../../redux/actions/internetAction";
import { updateDriverUserAction } from "../../redux/actions/taxista/driverAction";
import { testEmail } from "../../utils/testFormat.util";
//3166293271 juan pablo
//3015893695 Andres
//3183057560 Camilo

export default function DriverInfoForm(props) {
  const {
    nextPage,
    zones,
    update,
    driver,
    navigation,
    setShowAlert,
    isFirstTime,
  } = props;
  const { hp } = useDimensions();
  const dispatch = useDispatch();
  const { isConnected } = useNetInfo();
  const { colors } = useTheme();

  const [userData, setUserData] = useState(null);
  const [name, setName] = useState(driver?.user?.first_name || "");
  const [lastName, setLastName] = useState(driver?.user?.last_name || "");
  const [email, setEmail] = useState(driver?.user?.email || "");
  const [zone, setZone] = useState(driver?.user?.Zone || zones[0]);
  const [available, setAvailable] = useState(driver?.user?.available || 0);
  const [picture, setPicture] = useState(driver?.user?.photo || null);

  const [infoUpdate, setInfoUpdate] = useState(false);
  const [infoLoading, setInfoLoading] = useState(false);
  const [error, setError] = useState("");
  const [refreshError, setRefreshError] = useState(false);
  const [showZones, setShowZones] = useState(false);

  const notConnected = () => dispatch(setInternetState(false));

  const checkErrors = () => {
    //! VERIFICA ERRORES
    if (!name || !lastName || !email || !zone) {
      setError("Hay campos vacíos");
      setRefreshError(!refreshError);
      return true;
    }

    if (!testEmail(email)) {
      setError("Debes introducir un email valido");
      setRefreshError(!refreshError);
      return true;
    }
  };

  const submitUserInfo = () => {
    //! SUBMIT
    if (checkErrors()) return;
    setError("");

    const data = {
      first_name: name != driver?.user?.first_name ? name : null,
      last_name: lastName != driver?.user?.last_name ? lastName : null,
      email: email != driver?.user?.email ? email : null,
      zone: zone.id != driver?.user?.Zone?.id ? zone.id : null,
      available: available != driver?.user?.available ? available : null,
      picture: picture != driver?.user?.photo ? picture : null,
    };

    const hasChanged = Object.values(data).some((property) => property != null);

    if (hasChanged) {
      setUserData(data);
    } else {
      setUserData({});
    }
  };

  useEffect(() => {
    //! FORMULARIO COMPLETADO
    if (userData) {
      if (_.isEmpty(userData)) {
        if (update == null) {
          nextPage(1);
        } else if (update == "info" && !isFirstTime) {
          navigation.navigate("Profile", { notChange: true });
          return;
        }
      } else {
        sendData();
      }
    }
  }, [userData]);

  const sendData = async () => {
    //! ENVIO DE DATOS
    setInfoLoading(true);
    const userInfo = { ...userData };
    let infoData = new FormData();
    for (const [key, value] of Object.entries(userInfo)) {
      if (value != null) infoData.append(key, value);
    }

    if (update === undefined) {
      //! REGISTRO DOCUMENTOS
      infoData.append("should_complete_info", 0);
      infoData.append("complete_info", 0);
    }

    try {
      const apiResponse = await updateInfo(driver?.token, infoData);
      if (update == "info") {
        //! ACTUALIZAR LA INFORMACION EN EL REDUCER
        const newData = { ...driver, user: apiResponse.user };
        console.log({ newData });
        dispatch(updateDriverUserAction(newData));
      }
      setInfoLoading(false);
      setInfoUpdate(true);
    } catch (error) {
      setShowAlert(true);
      return;
    }
  };

  useEffect(() => {
    //! DATO ENVIADO CORRECTAMENTE A LA API
    if (infoUpdate) {
      setInfoUpdate(false);
      update == null ? nextPage(1) : nextPage(true);
    }
  }, [infoUpdate]);

  return (
    <>
      <H2>Valida tu información personal</H2>

      <TextInput
        inputStyle={{
          placeholder: "Nombre",
          autoCorrect: false,
          autoCompleteType: "name",
          value: name,
          left: <Input.Icon name="account" color={"grey"} />,
          onChangeText: (text) => setName(text),
        }}
      />

      <TextInput
        containerStyle={{
          style: {
            marginTop: hp(2),
          },
        }}
        inputStyle={{
          autoCorrect: false,
          placeholder: "Apellido",
          autoCompleteType: "name",
          value: lastName,
          left: <Input.Icon name="account" color={"grey"} />,
          onChangeText: (text) => setLastName(text),
        }}
      />

      <TextInput
        containerStyle={{
          style: {
            marginTop: hp(2),
          },
        }}
        inputStyle={{
          placeholder: "Email",
          value: email,
          autoCapitalize: "none",
          left: <Input.Icon name="email" color={"grey"} />,
          onChangeText: (text) => setEmail(text),
        }}
      />

      <TouchableOpacity
        style={[styles.pickerContainer, { marginTop: hp(2.4) }]}
        onPress={() => setShowZones(true)}
      >
        <Icon name="map-search" size={30} color={"grey"} />
        <Text style={[styles.zoneText, { color: colors.black }]}>
          {zone.zone}
        </Text>
        <Icon name="menu-down" size={30} color={"grey"} />
      </TouchableOpacity>

      {error.length > 0 && (
        <ErrorMessage reload={refreshError}>{error}</ErrorMessage>
      )}

      <SubmitButton
        buttonStyle={{
          marginTop: hp(4),
        }}
        onPress={() => (!isConnected ? notConnected() : submitUserInfo())}
      >
        {update == null ? "Continuar" : "Actualizar"}
      </SubmitButton>

      <ZonesModal
        show={showZones}
        setShow={setShowZones}
        data={zones}
        setZone={setZone}
      />
      <Loading isVisible={infoLoading} hasText={false} />
    </>
  );
}

const styles = StyleSheet.create({
  pickerContainer: {
    borderColor: "grey",
    borderWidth: 1,
    borderRadius: 100,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 5,
    paddingLeft: 10,
    paddingVertical: 6,
    width: "100%",
  },
  zoneText: {
    fontSize: 18,
    marginLeft: 6,
    flex: 1,
  },
});
