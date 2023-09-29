import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { useTheme } from "react-native-paper";
import { useDispatch } from "react-redux";
import { useNetInfo } from "@react-native-community/netinfo";
import { useInterval } from "../hooks/IntervalHook";
import { padStart } from "lodash";

import { TextInput } from "../components/Input";
import { ErrorMessage } from "../components/Alert";
import { H2 } from "../components/Typography";
import { SubmitButton } from "../components/Button";
import LottieModal from "../components/LottieModal";
import { InfoMessage } from "../components/Alert";
import { resendSignUpConfirm } from "../hooks/SignupConfirm.hooks";
import { useDimensions } from "../hooks/device.hooks";
import { useForgotPasswordSubmit } from "../hooks/RecoveryPasswordCode.hooks";
import { useSignin } from "../hooks/Login.hooks";
import { setInternetState } from "../redux/actions/internetAction";

export default function RecoveryPasswordCodeForm(props) {
  const { colors } = useTheme();
  const { email, navigation, username, reSend } = props;
  const [destType, setDestType] = useState("sms");
  const dispatch = useDispatch();
  const { isConnected } = useNetInfo();
  const [countdown, setCountdown] = useState(20);

  const {
    loading,
    error,
    forgotPasswordSubmit,
    ok,
  } = useForgotPasswordSubmit();
  const { signIn, errorCode: signinError } = useSignin(false, navigation);
  const { hp } = useDimensions();

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [code, setCode] = useState("");
  const [refrehsError, setRefrehsError] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const ForgotPasswordSubmit = async () => {
    //! HOOK DEL CONFIRM RECOVERY PASSWORD
    forgotPasswordSubmit({
      username,
      password,
      passwordConfirmation,
      code,
    });
    if (error) {
      setRefrehsError(!refrehsError);
    }
  };

  useInterval(
    () => {
      setCountdown(countdown - 1);
    },
    countdown != 0 ? 1000 : null
  );

  const sendCode = async (sendOption = "sms") => {
    resendSignUpConfirm(username, sendOption);
    setCountdown(20);
    setDestType(sendOption);
  };

  const notConnected = () => dispatch(setInternetState(false));

  useEffect(() => {
    //! REDIRECCIONA SI EL CODIGO ES CORRECTO
    if (ok) {
      signIn({ username, password });

      // setShowModal(true);
    }
  }, [ok]);

  useEffect(() => {
    //! REDIRECCIONA SI EL CODIGO ES CORRECTO
    if (signinError == "DriverNotFillData")
      navigation.navigate("RegisterDriver", {
        update: undefined,
        isFirstTime: true,
      });
    else if (signinError == "ClientNotFillData")
      navigation.navigate("RegisterUser", {
        update: null,
        username: username.split(" ").join(""),
        password,
        isFirstTime: true,
      });
  }, [signinError]);

  useEffect(() => {
    if (reSend === true) {
      sendCode();
    }
  }, [reSend]);

  return (
    <View>
      <H2>{reSend ? "Cambio de Contraseña" : "Recuperación de contraseña"}</H2>
      {reSend && (
        <Text style={{ marginHorizontal: 10, marginTop: 5 }}>
          Estamos actualizando y mejorando nuestros servicios, es necesario
          volver a crear una contraseña
        </Text>
      )}

      {typeof email == "string" && (
        <InfoMessage>
          Se ha enviado un código de verificación al{" "}
          <Text style={{ fontWeight: "bold" }}>
            {destType == "sms"
              ? "número"
              : destType == "email"
              ? "correo"
              : null}{" "}
            {destType == "sms" ? username : destType == "email" ? email : null}
          </Text>
          , ingresa el código para confirmar y finalizar el proceso de cambio de
          contraseña
        </InfoMessage>
      )}

      <TextInput
        inputStyle={{
          label: "Número de teléfono",
          //keyboardType:"numeric",
          value: username,
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

      {error && <ErrorMessage reload={refrehsError}>{error}</ErrorMessage>}

      <SubmitButton
        buttonStyle={{ marginTop: hp(4) }}
        mode="contained"
        onPress={() => (!isConnected ? notConnected() : ForgotPasswordSubmit())}
        loading={loading}
        disabled={loading}
      >
        Confirmar
      </SubmitButton>
      <SubmitButton
        buttonStyle={{ marginTop: hp(2), backgroundColor: "#000" }}
        mode="contained"
        onPress={() => (!isConnected ? notConnected() : sendCode())}
        disabled={countdown > 0}
        labelStyle={{ color: "#fff" }}
      >
        {countdown > 0 && `00:${padStart(countdown.toString(), 2, "0")}`}{" "}
        Reenviar código
      </SubmitButton>

      <TouchableOpacity
        style={{ alignSelf: "center", marginTop: 15 }}
        disabled={countdown != 0 || loading}
        onPress={() => (!isConnected ? notConnected() : sendCode("email"))}
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
      <LottieModal
        showModal={showModal}
        // redirect={() => navigation.navigate("Login")}
      />
    </View>
  );
}
