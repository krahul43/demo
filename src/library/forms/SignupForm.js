import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { useDispatch } from "react-redux";
import { useNetInfo } from "@react-native-community/netinfo";

import { TextInput } from "../components/Input";
import { ErrorMessage } from "../components/Alert";
import { H2 } from "../components/Typography";
import { SubmitButton, LinkButton } from "../components/Button";
import { TermsConditions } from "../components/Typography";

import { useDimensions } from "../hooks/device.hooks";
import { useSignin } from "../hooks/Login.hooks";
import { useSignup } from "../hooks/Signup.hooks";
import { setInternetState } from "../redux/actions/internetAction";
import { deleteDriverApiAction } from "../redux/actions/taxista/driverAction";

export default function SignupForm(props) {
  const { setUser, setDest, password, setPassword, navigation, type } = props;
  const {
    error: signupError,
    signUp,
    user,
    dest,
    errorCode: signupErrorCode,
    clearError: signupClearError,
    clearErrorCode: signupClearErrorCode,
  } = useSignup(navigation);
  const {
    error: signinError,
    signIn,
    errorCode: signinErrorCode,
    clearError: signinClearError,
    clearErrorCode: signinClearErrorCode,
    user: signInUser,
  } = useSignin(true, navigation);
  const { hp } = useDimensions();
  const dispatch = useDispatch();
  const { isConnected } = useNetInfo();

  const [email, setEmail] = useState(""); //? NO SE UTILIZAN POR AHORA
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("+57");
  const [refreshError, setRefreshError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [termsConditions, setTermsConditions] = useState(false);

  const Signup = () => {
    setLoading(true);
    signUp({
      username: phoneNumber.split(" ").join(""),
      email,
      password,
      password_confirmation: passwordConfirmation,
      phone_number: phoneNumber,
      terms: termsConditions,
      type,
    });
    setLoading(false);
  };

  const notConnected = () => dispatch(setInternetState(false));

  useEffect(() => {
    setUser(user);
    setDest(dest);
  }, [user, dest]);

  useEffect(() => {
    if (signupError != null && signupError != false) {
      setLoading(false);
      setError(signupError);
      setRefreshError(!refreshError);
      signupClearError();
    }
  }, [signupError]);

  useEffect(() => {
    if (signupErrorCode != null && signupErrorCode != false) {
      if (signupErrorCode == "UsernameExistsException") {
        signupClearErrorCode();
        signIn({ username: phoneNumber.split(" ").join(""), password });
      }
    }
  }, [signupErrorCode]);

  useEffect(() => {
    if (signinErrorCode != null && signinErrorCode != false) {
      console.error(signinErrorCode);
      signinClearErrorCode();
      if (signinErrorCode == "UserNotConfirmedException") {
        navigation.navigate("ConfirmSignup", {
          reSend: true,
          username: phoneNumber.split(" ").join(""),
          password,
          signInUser,
        });
      } else if (signinErrorCode == "PasswordNeeded") {
        navigation.navigate("RecoveryPasswordSubmit", {
          reSend: true,
          username,
          email,
        });
      } else {
        setLoading(false);
        setError(
          "El número ingresado ya existe por favor intente restablecer la contraseña"
        );
        setRefreshError(!refreshError);
      }
    }
  }, [signinErrorCode]);

  return (
    <View>
      <H2>Crear Cuenta</H2>

      <TextInput
        inputStyle={{
          label: "Número de teléfono",
          //keyboardType:'numeric',
          value: phoneNumber,
          onChangeText: (value) => setPhoneNumber(value),
        }}
      />

      <TextInput
        inputStyle={{
          label: "Correo Electronico",
          keyboardType: "email",
          value: email,
          onChangeText: (value) => setEmail(value),
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
          label: "Confirmar Contraseña",
          secureTextEntry: true,
          value: passwordConfirmation,
          onChangeText: (value) => setPasswordConfirmation(value),
        }}
      />

      <TermsConditions
        checkState={termsConditions}
        setCheckState={setTermsConditions}
        navigation={navigation}
      />

      {error && <ErrorMessage reload={refreshError}>{error}</ErrorMessage>}

      <SubmitButton
        buttonStyle={{ marginTop: hp(2) }}
        onPress={() => (!isConnected ? notConnected() : Signup())}
        loading={loading}
        disabled={loading}
      >
        Crear Cuenta
      </SubmitButton>

      <View style={{ marginTop: hp(3) }}>
        <LinkButton
          onPress={() =>
            !isConnected
              ? notConnected()
              : navigation.navigate("PasswordRecovery")
          }
          disabled={loading}
        >
          ¿Olvido su contraseña?
        </LinkButton>
        <LinkButton
          onPress={() => {
            dispatch(deleteDriverApiAction());
            !isConnected ? notConnected() : navigation.navigate("Login");
          }}
          disabled={loading}
        >
          Iniciar Sesión
        </LinkButton>
      </View>
    </View>
  );
}
