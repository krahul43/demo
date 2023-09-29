import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNetInfo } from "@react-native-community/netinfo";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";
import { TextInput as Input } from "react-native-paper";
import { CheckBox, colors } from "react-native-elements";
import { useTheme } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
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
import { testEmail } from "../../../library/utils/testFormat.util";

export default function UserInfoForm(props) {
  const {
    driver,
    zones,
    setFormCompleted,
    update,
    navigation,
    showAlert,
    setShowAlert,
    isFirstTime,
  } = props;
  const dispatch = useDispatch();
  const { hp } = useDimensions();
  const { isConnected } = useNetInfo();
  const {
    colors: { primary, black },
  } = useTheme();

  const [userData, setUserData] = useState(null);
  const [name, setName] = useState(driver?.user?.first_name || "");
  const [lastName, setLastName] = useState(driver?.user?.last_name || "");
  const [email, setEmail] = useState(driver?.user?.email || "");
  const [zone, setZone] = useState(driver?.user?.Zone || zones[0]);
  const [picture, setPicture] = useState(driver?.user?.photo || null);
  const [isPorter, setIsPorter] = useState(
    driver?.user?.type == "porter" || false
  );

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
      if (_.isEmpty(userData) && !isFirstTime) {
        //! SOLO SE CUMPLE EN EDICION (PRUEBA)
        navigation.navigate("Profile", { notChange: true });
        return;
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

    infoData.append("should_complete_info", 1);
    infoData.append("complete_info", 1);

    try {
      const apiResponse = await updateInfo(driver?.token, infoData);
      if (update == "info") {
        //! ACTUALIZAR LA INFORMACION EN EL REDUCER
        const newData = { ...driver, user: apiResponse };
        dispatch(updateDriverUserAction(newData));
      }
      setInfoLoading(false);
      setInfoUpdate(true);
    } catch (error) {
      console.log(error);
      setShowAlert(true);
      return;
    }
  };

  useEffect(() => {
    if (showAlert) {
      setInfoLoading(false);
    }
  }, [showAlert]);

  useEffect(() => {
    //! DATO ENVIADO CORRECTAMENTE A LA API
    if (infoUpdate) {
      setFormCompleted(true);
    }
  }, [infoUpdate]);

  return (
    <>
      <H2>Ingresa la siguiente informacion</H2>

      <TextInput
        inputStyle={{
          placeholder: "Nombre",
          autoCorrect: false,
          autoCompleteType: "name",
          value: name,
          left: (
            <Input.Icon
              name="account"
              color={"grey"}
              style={{ marginRight: 20 }}
            />
          ),
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
          left: (
            <Input.Icon
              name="account"
              color={"grey"}
              style={{ marginRight: 20 }}
            />
          ),
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
          left: (
            <Input.Icon
              name="email"
              color={"grey"}
              style={{ marginRight: 20 }}
            />
          ),
          onChangeText: (text) => setEmail(text),
        }}
      />

      <TouchableOpacity
        style={[styles.pickerContainer, { marginTop: hp(2.4) }]}
        onPress={() => setShowZones(true)}
      >
        <Icon name="map-search" size={30} color={"grey"} />
        <Text style={[styles.zoneText, { color: black }]}>{zone.zone}</Text>
        <Icon name="menu-down" size={30} color={"grey"} />
      </TouchableOpacity>

      {error.length > 0 && (
        <ErrorMessage reload={refreshError}>{error}</ErrorMessage>
      )}

      <SubmitButton
        buttonStyle={{
          marginTop: hp(3),
          marginBottom: 10,
        }}
        onPress={() => (!isConnected ? notConnected() : submitUserInfo())}
      >
        {update == "info" ? "Actualizar" : "Registrarse"}
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
  porterView: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  porterCheck: {
    paddingRight: 0,
    marginRight: 5,
    marginLeft: 5,
    paddingLeft: 0,
  },
  porterText: {
    fontSize: 16,
  },
});
