import React, { useEffect } from "react";
import { View, StyleSheet, BackHandler } from "react-native";
import { useDispatch } from "react-redux";

import AppContainerForm from "../../library/components/AppContainerForm";
import { H3 } from "../../library/components/Typography";
import { SubmitButton } from "../../library/components/Button";

import { useDimensions } from "../../library/hooks/device.hooks";
import { signOut } from "../../library/hooks/User.hooks";
import { deleteDriverApiAction } from "../../library/redux/actions/taxista/driverAction";

export default function ConfirmMesageView({ navigation, route }) {
  const { errorType, username, password } = route.params;
  const { hp } = useDimensions();
  const dispatch = useDispatch();
  const next = async () => {
    //! REDIRECCIONA SEGUN EL ERROR
    console.log(errorType);
    if (errorType == "UserNotConfirmedException") {
      console.log("Codigo Reenviado");
      navigation.navigate("ConfirmSignup", {
        reSend: true,
        username: username,
        password,
      });
    } else if (errorType == "NewUserNotConfirmedException") {
      navigation.navigate("VerifyPhone", {
        username: username,
        loged: false,
        password: password,
      });
    } else if (errorType == "NotReviewData") {
      navigation.navigate("Login");
    } else if (errorType == "NotValidDocuments") {
      navigation.navigate("RegisterDriver", { update: null });
    }
  };

  useEffect(() => {
    //! LIMIPIA DATOS QUE PUEDAN CAUSAR ERRORES SI SE REGRESA
    const onBackPress = () => {
      signOut();
      dispatch(deleteDriverApiAction());
      navigation.goBack();
      return true;
    };
    BackHandler.addEventListener("hardwareBackPress", onBackPress);

    return () => BackHandler.removeEventListener("hardwareBackPress");
  }, []);

  return (
    <AppContainerForm navigation={navigation} backButton={false}>
      <View style={styles.centerContainer}>
        <H3 style={{ textAlign: "center" }}>
          {
            errorType == "UserNotConfirmedException"
              ? `Telefono no confirmado, se le enviará nuevamente el código de verificación, debe ingresar el código para completar el registro`
              : errorType == "NewUserNotConfirmedException"
              ? `Ingrese el código de verificación completar el cambio de número`
              : errorType == "NotReviewData"
              ? `Sus documentos estan en espera de revisión, cuando estos sean aprobados podrá ingresar a la aplicación`
              : `Sus documentos no fueron aceptados, por favor corríjalos para procesarlos nuevamente` //? NotValidDocuments
          }
        </H3>
        <SubmitButton onPress={() => next()} buttonStyle={{ marginTop: hp(3) }}>
          {
            errorType == "UserNotConfirmedException"
              ? `Confirmar Registro`
              : errorType == "NewUserNotConfirmedException"
              ? `Confirmar Nùmero`
              : errorType == "NotReviewData"
              ? `Volver`
              : `Continuar` //? NotValidDocuments
          }
        </SubmitButton>
      </View>
    </AppContainerForm>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});
