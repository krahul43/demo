import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNetInfo } from "@react-native-community/netinfo";

import { H2 } from "../components/Typography";
import { TextInput } from "../components/Input";
import { SubmitButton, LinkButton } from "../components/Button";
import { ErrorMessage } from "../components/Alert";

import { useDimensions } from "../hooks/device.hooks";
import { useSignin } from "../hooks/Login.hooks";
import { setInternetState } from "../redux/actions/internetAction";
import { deleteDriverApiAction } from "../redux/actions/taxista/driverAction";

export default function LoginForm(props) {
  const { navigation } = props;
  const {
    loading,
    error: signinError,
    signIn,
    errorCode,
    clearErrorCode,
    clearError,
    user,
  } = useSignin(false, navigation);
  const { hp } = useDimensions();

  const dispatch = useDispatch();
  const { isConnected } = useNetInfo();
  const { driver } = useSelector(({ driverReducer }) => driverReducer);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("+57");
  const [error, setError] = useState(null);
  const [refreshError, setRefreshError] = useState(false);

  const SignIn = () => {
    signIn({ username: username.split(" ").join(""), password });
  };

  useEffect(() => {
    if (signinError != null && signinError != false) {
      setError(signinError);
      setRefreshError(!refreshError);
      clearError();
    }
  }, [signinError]);

  const notConnected = () => dispatch(setInternetState(false));
  console.log(user);
  useEffect(() => {
    if (errorCode && user) {
      setError(null);
      console.log({ errorCode });
      if (errorCode == "DriverNotFillData")
        navigation.navigate("RegisterDriver", { update: undefined });
      else if (errorCode == "ClientNotFillData")
        navigation.navigate("RegisterUser", {
          update: null,
          username: username.split(" ").join(""),
          password,
        });
      else if (errorCode != "NotAuthorizedException")
        navigation.navigate("ErrorMessage", {
          errorType: errorCode,
          username: username.split(" ").join(""),
          user,
          password,
        });
    }
  }, [errorCode]);

  useEffect(() => {
    //! LIMPIA DATOS QUE PUEDAN CAUSAR ERRORES
    const unsubscribe = navigation.addListener("focus", (event) => {
      setUsername("+57");
      setPassword("");
      clearErrorCode();
    });
    return () => unsubscribe();
  }, []);

  return (
    <View>
      <H2 style={{ marginBottom: 10 }}>Iniciar Sesión</H2>
      <TextInput
        inputStyle={{
          label: "Número de teléfono",
          value: username,
          //keyboardType:'numeric',
          onChangeText: (value) => setUsername(value),
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
      {error && <ErrorMessage reload={refreshError}>{error}</ErrorMessage>}
      <SubmitButton
        buttonStyle={{ marginTop: hp(4) }}
        loading={loading}
        disabled={loading}
        onPress={() => {
          clearError();
          !isConnected ? notConnected() : SignIn();
        }}
      >
        Iniciar Sesión
      </SubmitButton>
      <View style={{ marginTop: hp(3.5) }}>
        <LinkButton
          onPress={() => {
            clearError();
            !isConnected
              ? notConnected()
              : navigation.navigate("RegisterOptions");
          }}
          disabled={loading}
        >
          Crear cuenta
        </LinkButton>
        <LinkButton
          onPress={() => {
            clearError();
            !isConnected
              ? notConnected()
              : navigation.navigate("PasswordRecovery");
          }}
          disabled={loading}
        >
          Olvido su contraseña
        </LinkButton>
      </View>
    </View>
  );
}
