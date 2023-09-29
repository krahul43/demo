import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNetInfo } from "@react-native-community/netinfo";

import { TextInput } from "../components/Input";
import { ErrorMessage } from "../components/Alert";
import { H2 } from "../components/Typography";
import { SubmitButton } from "../components/Button";

import { useDimensions } from "../hooks/device.hooks";
import { useChangePhone } from "../hooks/ChangePhoneHook";
import { setInternetState } from "../redux/actions/internetAction";

export default function ChangePhoneForm(props) {
  const { driver } = useSelector(({ driverReducer }) => driverReducer);
  const { navigation } = props;
  const { loading, error, ok, changePhoneSubmit } = useChangePhone();
  const { hp } = useDimensions();
  const dispatch = useDispatch();
  const { isConnected } = useNetInfo();

  const [password, setPassword] = useState("");
  const [newPhoneNumber, setNewPhoneNumber] = useState("+57");
  const [refreshError, setRefreshError] = useState(false);

  const ChangePhoneSubmit = () => {
    //! HOOK PARA CAMBIAR EL NUMERO
    changePhoneSubmit({
      username: driver?.user?.phone_number,
      password,
      new_phoneNumber: newPhoneNumber.split(" ").join(""),
    });
    if (error) setRefreshError(!refreshError);
  };

  const notConnected = () => dispatch(setInternetState(false));

  useEffect(() => {
    //! SI PASA LAS VALIDACIONES SE REDIRECCIONA A CONFIRMAR EL CELULAR
    if (ok) {
      navigation.navigate("VerifyPhone", {
        username: newPhoneNumber.split(" ").join(""),
        loged: true,
      });
    }
  }, [ok]);

  return (
    <View>
      <H2>Actualizar Número</H2>

      <TextInput
        inputStyle={{
          label: "Número de teléfono actual",
          //keyboardType:'numeric',
          value: driver?.user?.phone_number,
          disabled: true,
        }}
      />

      <TextInput
        inputStyle={{
          label: "Contraseña",
          secureTextEntry: true,
          value: password,
          onChangeText: (value) => setPassword(value),
        }}
      />

      <TextInput
        inputStyle={{
          label: "Nuevo número de telefono",
          value: newPhoneNumber,
          onChangeText: (value) => setNewPhoneNumber(value),
        }}
      />

      {error && <ErrorMessage reload={refreshError}>{error}</ErrorMessage>}

      <SubmitButton
        buttonStyle={{ marginTop: hp(2) }}
        onPress={() => (!isConnected ? notConnected() : ChangePhoneSubmit())}
        loading={loading}
        disabled={loading}
      >
        Actualizar Telèfono
      </SubmitButton>
    </View>
  );
}
