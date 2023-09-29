import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useDispatch } from "react-redux";
import { useNetInfo } from "@react-native-community/netinfo";
import { padStart } from "lodash";

import { TextInput } from "../components/Input";
import { InfoMessage, ErrorMessage } from "../components/Alert";
import { H2 } from "../components/Typography";
import { SubmitButton } from "../components/Button";

import { useDimensions } from "../hooks/device.hooks";
import { useSignin } from "../hooks/Login.hooks";
import { useInterval } from "../hooks/IntervalHook";
import { useSignupConfirm } from "../hooks/SignupConfirm.hooks";
import { resendSignUpConfirm } from "../hooks/SignupConfirm.hooks";
import { setInternetState } from "../redux/actions/internetAction";
import { useTheme } from "react-native-paper";
import InfoModal from "../components/InfoModal";

export default function ConfirmSignupForm(props) {
  const {
    destination,
    username,
    password,
    navigation,
    sendCode,
    email,
  } = props;
  const {
    error: signupConfirmError,
    signUpConfirm,
    ok,
    clearError: singupConfirmClearError,
  } = useSignupConfirm();
  const {
    error: signinError,
    signIn,
    errorCode,
    clearError: signinClearError,
  } = useSignin(false, navigation);
  const { hp } = useDimensions();
  const dispatch = useDispatch();
  const { isConnected } = useNetInfo();
  const { colors } = useTheme();

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [refreshError, setRefreshError] = useState(false);
  const [countdown, setCountdown] = useState(20);
  const [showModal, setShowModal] = useState(false);
  const [dest, setDest] = useState(false);
  const [destType, setDestType] = useState("sms");

  useInterval(
    () => {
      setCountdown(countdown - 1);
    },
    countdown != 0 ? 1000 : null
  );

  const SignupConfirm = () => {
    //! HOOK DEL CONFIRM SING UP
    setLoading(true);
    signUpConfirm({
      username,
      code,
    });
  };

  const resendCode = async () => {
    sendCode();
    setCountdown(20);
    setDestType("sms");
  };

  const sendCodeToEmail = async () => {
    sendCode("email");
    setCountdown(20);
    setDestType("email");
  };

  const notConnected = () => dispatch(setInternetState(false));

  useEffect(() => {
    //! REDIRECCIONA SI EL CODIGO ES CORRECTO
    if (ok) {
      signIn({ username, password });
    }
  }, [ok]);

  useEffect(() => {
    if (signupConfirmError != null && signupConfirmError != false) {
      setLoading(false);
      setError(signupConfirmError);
      setRefreshError(!refreshError);
      singupConfirmClearError();
    }
  }, [signupConfirmError]);

  useEffect(() => {
    if (signinError != null && signinError != false) {
      setLoading(false);
      setError(signinError);
      setRefreshError(!refreshError);
      signinClearError();
    }
  }, [signinError]);

  useEffect(() => {
    //! VERIFICA EL ESTADO DEL USUARIO
    if (errorCode) {
      if (errorCode == "DriverNotFillData")
        navigation.navigate("RegisterDriver", { update: undefined });
      else if (errorCode == "ClientNotFillData")
        navigation.navigate("RegisterUser", {
          update: null,
          username,
          password,
        });
    }
  }, [errorCode]);

  useEffect(() => {
    if (destination) setDest(destination);
  }, [destination]);

  return (
    <View>
      <H2>Confirmar Registro</H2>

      {(typeof destination == "string" || username) && (
        <InfoMessage>
          Se ha enviado un código de verificación al{" "}
          {`${
            destType === "sms"
              ? "número"
              : destType === "email"
              ? "correo"
              : null
          } `}
          {destination ? destination : username}, ingresa el código para
          confirmar y finalizar el proceso de registro
        </InfoMessage>
      )}

      <TextInput
        inputStyle={{
          label: "Número de teléfono",
          //keyboardType:"numeric",
          value: username,
          readonly: true,
        }}
      />

      <TextInput
        inputStyle={{
          label: "Código de verificación",
          keyboardType: "numeric",
          value: code,
          onChangeText: (value) => setCode(value),
        }}
      />

      {error && <ErrorMessage reload={refreshError}>{error}</ErrorMessage>}

      <SubmitButton
        buttonStyle={{ marginTop: hp(4) }}
        mode="contained"
        onPress={() => (!isConnected ? notConnected() : SignupConfirm())}
        loading={loading}
        disabled={loading}
      >
        Confirmar Registro
      </SubmitButton>

      <SubmitButton
        buttonStyle={{ marginTop: hp(2), backgroundColor: "#000" }}
        mode="contained"
        onPress={() => (!isConnected ? notConnected() : resendCode())}
        disabled={countdown != 0 || loading}
        labelStyle={{ color: "#fff" }}
      >
        {countdown > 0 && `00:${padStart(countdown.toString(), 2, "0")}`}{" "}
        Reenviar Codigo
      </SubmitButton>

      <TouchableOpacity
        style={{ alignSelf: "center", marginTop: 15 }}
        disabled={countdown != 0 || loading}
        onPress={() => (!isConnected ? notConnected() : sendCodeToEmail())}
      >
        <Text
          style={{
            color: countdown != 0 || loading ? "gray" : colors.primary,
            fontWeight: "bold",
          }}
        >
          Enviar codigo al correo
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{ alignSelf: "center", marginTop: 15 }}
        onPress={() => setShowModal(true)}
      >
        <Text
          style={{
            color: colors.primary,
            textDecorationLine: "underline",
            fontWeight: "bold",
          }}
        >
          ¿No llega el codigo de confirmación ?
        </Text>
      </TouchableOpacity>

      <InfoModal
        show={showModal}
        setShow={setShowModal}
        title={"Problemas con el codigo de confirmación"}
        message={
          "Si después de presionar la opción de reenviar código, este aun no llega al celular, por favor intente lo siguiente:"
        }
        confirmAction={() => setShowModal(false)}
        declineAction={false}
        children={
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontStyle: "italic", fontSize: 15 }}>
              <Text style={{ color: colors.primary }}>• </Text>
              Verifique que el número ingresado sea correcto.
            </Text>
            <Text style={{ fontStyle: "italic", fontSize: 15, marginTop: 5 }}>
              <Text style={{ color: colors.primary }}>• </Text>
              Verifique que las notificaciones por SMS estén activadas en la
              configuracion del telefono.
            </Text>
            <Text style={{ fontStyle: "italic", fontSize: 15, marginTop: 5 }}>
              <Text style={{ color: colors.primary }}>• </Text>
              Enviar cofigo al correo {email}.
            </Text>
            <Text style={{ fontStyle: "italic", fontSize: 15, marginTop: 5 }}>
              <Text style={{ color: colors.primary }}>• </Text>
              Cierre la aplicación y vuelva a abrirla.
            </Text>
          </View>
        }
      />
    </View>
  );
}
