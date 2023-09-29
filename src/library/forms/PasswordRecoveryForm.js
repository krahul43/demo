import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { useDispatch } from "react-redux";
import { useNetInfo } from "@react-native-community/netinfo";

import { TextInput } from "../components/Input";
import { H2 } from "../components/Typography";
import { SubmitButton, LinkButton } from "../components/Button";
import { ErrorMessage } from "../components/Alert";

import { useForgotPassword } from "../hooks/RecoveryPassword.hooks";
import { useDimensions } from "../hooks/device.hooks";
import { deleteDriverApiAction } from "../redux/actions/taxista/driverAction";
import { setInternetState } from "../redux/actions/internetAction";

export default function PasswordRecoveryForm(props) {
  const { username, setUsername, setEmail, navigation } = props;
  const { loading, error, email, forgotPassword } = useForgotPassword();
  const { hp } = useDimensions();
  const dispatch = useDispatch();
  const { isConnected } = useNetInfo();

  const [refreshError, setRefreshError] = useState(false);

  const ForgotPassword = async () => {
    //! HOOK DEL FORGET PASSWORD
    forgotPassword(username.split(" ").join(""));
    if (error) {
      setRefreshError(!refreshError);
    }
  };

  const notConnected = () => dispatch(setInternetState(false));

  useEffect(() => {
    //! SETEA EL NUMERO AL QUE SE LE ENVIA EL CODIGO
    setEmail(email);
  }, [email]);

  return (
    <View>
      <H2>Recuperar Contraseña</H2>

      <TextInput
        inputStyle={{
          label: "Número de teléfono",
          //keyboardType:"numeric",
          value: username,
          onChangeText: (value) => setUsername(value),
        }}
      />

      {error && <ErrorMessage reload={refreshError}>{error}</ErrorMessage>}

      <SubmitButton
        buttonStyle={{ marginTop: hp(4) }}
        mode="contained"
        loading={loading}
        onPress={() => (!isConnected ? notConnected() : ForgotPassword())}
        disabled={loading}
      >
        Recuperar Contraseña
      </SubmitButton>

      <View style={{ marginTop: hp(3.5) }}>
        <LinkButton
          disabled={loading}
          onPress={() => {
            dispatch(deleteDriverApiAction());
            !isConnected ? notConnected() : navigation.navigate("Login");
          }}
        >
          Iniciar Sesión
        </LinkButton>
        <LinkButton
          onPress={() =>
            !isConnected
              ? notConnected()
              : navigation.navigate("RegisterOptions")
          }
          disabled={loading}
        >
          Crear Cuenta
        </LinkButton>
      </View>
    </View>
  );
}
