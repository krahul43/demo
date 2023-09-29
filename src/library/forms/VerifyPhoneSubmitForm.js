import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNetInfo } from "@react-native-community/netinfo";

import { TextInput } from "../components/Input";
import { InfoMessage, ErrorMessage } from "../components/Alert";
import { H2 } from "../components/Typography";
import { SubmitButton } from "../components/Button";

import { useDimensions } from "../hooks/device.hooks";
import { useVerifyPhoneSubmit } from "../hooks/VerifyPhoneHook";
import { useSignin } from "../hooks/Login.hooks";
import { signOut } from "../hooks/User.hooks";
import { updateDriverUserAction } from "../redux/actions/taxista/driverAction";
import { setInternetState } from "../redux/actions/internetAction";

export default function VerifyPhoneSubmitForm(props) {
  const { username, password, navigation, loged } = props;
  const {
    error: { confirmCodeError },
    verifyPhoneSubmit,
    ok,
  } = useVerifyPhoneSubmit();
  const {
    error: { loginError },
    signIn,
    errorCode,
  } = useSignin();
  const { driver } = useSelector(({ driverReducer }) => driverReducer);
  const { hp } = useDimensions();
  const dispatch = useDispatch();
  const { isConnected } = useNetInfo();

  const [code, setCode] = useState("");
  const [refreshError, setRefreshError] = useState(false);
  const [loading, setLoading] = useState(false);

  const VerifyPhoneSubmit = () => {
    setLoading(true);
    //! HOOK QUE VERIFICA EL CODIGO
    verifyPhoneSubmit({ code });
    if (confirmCodeError) {
      setRefreshError(!refreshError);
      setLoading(false);
    }
  };

  const notConnected = () => dispatch(setInternetState(false));

  const exit = async () => {
    //! CERRAR SESION
    await signOut();
    dispatch(deleteDriverApiAction());
  };

  useEffect(() => {
    //! REDIRECCIONA A UNA VISTA QUE DEPENDE DE SI ESTA LOGEADO O NO
    if (ok) {
      if (loged) {
        const updateData = {
          ...driver,
          user: { ...driver.user, phone_number: username },
        };
        dispatch(updateDriverUserAction(updateData));
        navigation.navigate("Profile", { notChange: false });
      } else {
        signIn({ username, password });
        if (loginError) {
          setRefreshError(!refreshError);
          setLoading(false);
        }
      }
    }
  }, [ok]);

  return (
    <View>
      <H2>Confirmar Registro</H2>

      <InfoMessage>
        Se ha enviado un código de verificación al número {username}, ingresa el
        código para confirmar y finalizar el proceso de registro
      </InfoMessage>

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
          label: "Códido de verificación",
          keyboardType: "numeric",
          value: code,
          onChangeText: (value) => setCode(value),
        }}
      />

      {(confirmCodeError || loginError) && (
        <ErrorMessage reload={refreshError}>
          {confirmCodeError || loginError}
        </ErrorMessage>
      )}

      <SubmitButton
        buttonStyle={{ marginTop: hp(4) }}
        mode="contained"
        onPress={() => (!isConnected ? notConnected() : VerifyPhoneSubmit())}
        loading={loading}
        disabled={loading}
      >
        Actualizar Teléfono
      </SubmitButton>
    </View>
  );
}
