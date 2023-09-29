import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { useDispatch } from "react-redux";
import { useNetInfo } from "@react-native-community/netinfo";

import { TextInput } from "../components/Input";
import { ErrorMessage } from "../components/Alert";
import { H2 } from "../components/Typography";
import { SubmitButton } from "../components/Button";
import LottieModal from "../components/LottieModal";

import { useDimensions } from "../hooks/device.hooks";
import { useChangePasswordSubmit } from "../hooks/ChangePasswordHook";
import { signOut } from "../hooks/User.hooks";
import { setInternetState } from "../redux/actions/internetAction";
import { deleteDriverApiAction } from "../redux/actions/taxista/driverAction";

export default function ChangePasswordForm() {
  const {
    loading,
    error,
    ok,
    changePasswordSubmit,
  } = useChangePasswordSubmit();
  const { hp } = useDimensions();
  const dispatch = useDispatch();
  const { isConnected } = useNetInfo();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [refrehsError, setRefrehsError] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const ChangePasswordSubmit = async () => {
    //! HOOK PARA EL CAMBIO DE CONTRASEÑA
    changePasswordSubmit({
      old_password: oldPassword,
      new_password: newPassword,
      confirm_new_password: confirmNewPassword,
    });

    if (error) setRefrehsError(!refrehsError);
  };

  const exit = async () => {
    //! CERRAR SESION
    await signOut();
    dispatch(deleteDriverApiAction());
  };

  const notConnected = () => dispatch(setInternetState(false));

  useEffect(() => {
    //! REDIRECCIONA AL LOGIN SI EL PROCESO ES EXITOSO
    if (ok) {
      setShowModal(true);
    }
  }, [ok]);

  return (
    <View>
      <H2>Cambio de contraseña</H2>

      <TextInput
        inputStyle={{
          label: "Contraseña Actual",
          secureTextEntry: true,
          value: oldPassword,
          onChangeText: (value) => setOldPassword(value),
        }}
      />

      <TextInput
        inputStyle={{
          label: "Nueva Contraseña",
          secureTextEntry: true,
          value: newPassword,
          onChangeText: (value) => setNewPassword(value),
        }}
      />

      <TextInput
        inputStyle={{
          label: "Confirmar Nueva Contraseña",
          secureTextEntry: true,
          value: confirmNewPassword,
          onChangeText: (value) => setConfirmNewPassword(value),
        }}
      />

      {error && <ErrorMessage reload={refrehsError}>{error}</ErrorMessage>}

      <SubmitButton
        buttonStyle={{ marginTop: hp(4) }}
        mode="contained"
        onPress={() => (!isConnected ? notConnected() : ChangePasswordSubmit())}
        loading={loading}
        disabled={loading}
      >
        Cambiar Contraseña
      </SubmitButton>

      <LottieModal showModal={showModal} redirect={exit} />

      <LottieModal showModal={showModal} redirect={exit} />
    </View>
  );
}
