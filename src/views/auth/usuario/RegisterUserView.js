import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import AppContainerForm from "../../../library/components/AppContainerForm";
import Loading from "../../../library/components/Loading";
import UserInfoForm from "../../../library/forms/usuario/UserInfoForm";
import InfoModal from "../../../library/components/InfoModal";
import AlertModal from "../../../library/components/AlertModal";

import { getZones } from "../../../library/networking/API";
import { signOut } from "../../../library/hooks/User.hooks";
import { useSignin } from "../../../library/hooks/Login.hooks";
import { useLockOrientation } from "../../../library/hooks/LockOrientationHook";
import { deleteDriverApiAction } from "../../../library/redux/actions/taxista/driverAction";

export default function RegisterUserView({ navigation, route }) {
  const { update, username, password, isFirstTime } = route.params;
  const dispatch = useDispatch();
  const {
    loading,
    error: { loginError },
    signIn,
    errorCode,
  } = useSignin();
  useLockOrientation();

  const { driver } = useSelector(({ driverReducer }) => driverReducer);

  const [formCompleted, setFormCompleted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [zones, setZones] = useState(null);

  const setAvailableZones = async () => {
    //! TRAER ZONAS
    try {
      console.log({ driver });
      const availableZones = await getZones(driver?.token);
      setZones(availableZones);
    } catch (error) {
      console.error(error);
      setShowAlert(true);
      navigation.goBack();
    }
  };

  useEffect(() => {
    //!TRAER ZONAS
    setAvailableZones();
  }, []);

  useEffect(() => {
    //! UNA VEZ SE COMPLETA EL FORMUARIO
    if (formCompleted) {
      if (update == "info") {
        return navigation.navigate("Profile", { notChange: false });
      } else {
        console.log("FORMULARIO COMPLETADO");
        signIn({ username, password });
      }
    }
  }, [formCompleted]);

  const closeAlert = () => setShowAlert(false); //! CERRAR ALERTA POR ERROR EN SUBIDA DE DOCUMENTOS

  const exit = () => {
    //! SALIR DEL FORMULARIO
    signOut();
    dispatch(deleteDriverApiAction());
    if (update == null) {
      navigation.navigate("Login");
    }
  };

  return zones == null ? (
    <Loading isVisible={true} hasText={false} />
  ) : (
    <>
      <AppContainerForm
        navigation={navigation}
        preventExit={update == null}
        toLogin={update == null}
        profile={update != null}
      >
        <UserInfoForm
          zones={zones}
          driver={driver}
          update={update}
          setFormCompleted={setFormCompleted}
          navigation={navigation}
          showAlert={showAlert}
          setShowAlert={setShowAlert}
          isFirstTime={isFirstTime}
        />
        <InfoModal
          show={showSuccess}
          setShow={setShowSuccess}
          title={"Informacion"}
          message={"Los datos se cargaron correctamente"}
          declineAction={false}
          confirmAction={exit}
        />
      </AppContainerForm>
      <AlertModal
        isVisible={showAlert}
        text={
          "Hubo un error al cargar el la informacion, por favor verifica tu conexion a internet"
        }
        icon={"information"}
        closeFunction={closeAlert}
      />
      <Loading isVisible={loading} hasText={false} />
    </>
  );
}
