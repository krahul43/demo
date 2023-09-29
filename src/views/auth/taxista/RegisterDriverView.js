import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import AppContainerForm from "../../../library/components/AppContainerForm";
import Bullets from "../../../library/components/Bullets";
import Loading from "../../../library/components/Loading";

import DriverInfoForm from "../../../library/forms/taxista/DriverInfoForm";
import DriverDocumentForm from "../../../library/forms/taxista/DriverDocumentForm";
import InfoModal from "../../../library/components/InfoModal";
import AlertModal from "../../../library/components/AlertModal";

import {
  getLogedDocuments,
  getDocumentTypes,
  getZones,
} from "../../../library/networking/API";
import { useDimensions } from "../../../library/hooks/device.hooks";
import { signOut } from "../../../library/hooks/User.hooks";
import { useLockOrientation } from "../../../library/hooks/LockOrientationHook";
import { deleteDriverApiAction } from "../../../library/redux/actions/taxista/driverAction";

export default function RegisterDriverView({ navigation, route }) {
  const { update, isFirstTime = false } = route.params;
  const dispatch = useDispatch();
  const { wp, hp } = useDimensions();
  const scrollRef = useRef(null);
  useLockOrientation();

  const [changeCounter, setChangeCounter] = useState(0);

  const { driver } = useSelector(({ driverReducer }) => driverReducer);

  const [dataSource, setDataSource] = useState(null);
  const [zones, setZones] = useState(null);
  const [scrollWidth, setScrollWidth] = useState(null);
  const [errorsIndex, setErrorsIndex] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [formCompleted, setFormCompleted] = useState(false);

  const nextPage = (index) => {
    //! SIGUIETE PAGINA
    const offset = wp(100 * index);
    scrollRef.current.scrollTo({ x: offset, y: 0, animated: true });
  };

  const previousPage = (index) => {
    //! ANTERIOR PAGINA
    const offset = wp(100 * index - 100);
    scrollRef.current.scrollTo({ x: offset, y: 0, animated: true });
  };

  const setAvailableZones = async () => {
    //! TRAER ZONAS
    try {
      const availableZones = await getZones(driver?.token);
      setZones(availableZones);
    } catch (error) {
      setShowAlert(true);
      navigation.goBack();
    }
  };

  const setFirstTimeDocuments = async () => {
    //! SETEAR DOCUMENTOS POR PRIMERA VEZ
    try {
      const documenTypes = await getDocumentTypes(driver?.token);
      const sentDocuments = driver?.userDocuments || [];
      const unsentDocuments = documenTypes.slice(sentDocuments.length);
      const firsTimeDocuments = sentDocuments.concat(unsentDocuments);
      setScrollWidth([
        100 * (firsTimeDocuments.length + 1),
        firsTimeDocuments.length + 1,
      ]);
      setDataSource(firsTimeDocuments);
    } catch (error) {
      console.error(error);
      setShowAlert(true);
      navigation.goBack();
    }
  };

  const setReviewedDocuments = async () => {
    //! SETEAR DOCUMENTOS PARA CORRECCION
    const reviewedDocuments = driver?.userDocuments || [];
    setScrollWidth([
      100 * (reviewedDocuments.length + 1),
      reviewedDocuments.length + 1,
    ]);
    let errorIndices = [];
    reviewedDocuments.forEach((item, index) => {
      if (item?.Review?.status == 0) errorIndices.push(index + 1);
    });
    setErrorsIndex(errorIndices);
    setDataSource(reviewedDocuments);
  };

  const setLogedDocuments = async () => {
    //! SETEAR DOCUMENTOS PARA EDICION
    try {
      const logedDocuments = await getLogedDocuments(driver?.token);
      setScrollWidth([100 * logedDocuments.length, logedDocuments.length]);
      setDataSource(logedDocuments);
    } catch (error) {
      setShowAlert(true);
      navigation.goBack();
    }
  };

  const closeAlert = () => setShowAlert(false); //! CERRAR ALERTA POR ERROR EN SUBIDA DE DOCUMENTOS

  const exit = () => {
    //! SALIR DEL FORMULARIO
    signOut();
    dispatch(deleteDriverApiAction());
    if (update == null) {
      navigation.navigate("Login");
    }
  };

  useEffect(() => {
    //! FUENTE DE LOS DATOS SEGUN EL ESTADO DEL USUARIO
    setAvailableZones();
    if (update === undefined) {
      //! REGISTRAR DOCUMENTOS
      console.log("REGISTRAR DOCUMENTOS");
      setFirstTimeDocuments();
    } else if (update === null) {
      //! CORREGIR DOCUMENTOS
      console.log("CORREGIR DOCUMENTOS");
      setReviewedDocuments();
    } else if (update == "documents") {
      //! ACTUALIZAR DOCUMENTOS
      console.log("ACTUALIZAR DOCUMENTOS");
      setLogedDocuments();
    } else if (update == "info") {
      //! ACTUALIZAR INFO
      console.log("ACTUALIZAR INFO");
      setScrollWidth([100, 1]);
      setDataSource([]);
    }
  }, []);

  useEffect(() => {
    //! UNA VEZ SE COMPLETA EL FORMUARIO
    if (formCompleted) {
      if (update == "documents" && changeCounter == 0) {
        //! EDICION (SIN CAMBIAR DOCUMENTOS)
        navigation.navigate("Profile", { notChange: true });
      } else if (update == "info") {
        //! EDICION DE INFORMACION
        navigation.navigate("Profile", { notChange: false });
      } else if (update != "info") {
        //! REGISTRO / CORRECCION / EDICION (CAMIANDO DOCUMENTOS)
        setShowSuccess(true);
      }
    }
  }, [formCompleted]);

  return dataSource == null || zones == null ? (
    <Loading isVisible={true} hasText={false} />
  ) : (
    <>
      <AppContainerForm
        navigation={navigation}
        documentsView={true}
        preventExit={true}
        updateDocumentType={update}
        changeCounter={changeCounter}
      >
        <View style={{ top: -hp(3) }}>
          <ScrollView
            ref={scrollRef}
            horizontal={true}
            scrollEnabled={false}
            contentContainerStyle={{ width: `${scrollWidth[0]}%` }}
            showsHorizontalScrollIndicator={false}
          >
            {(update == "info" || update == null) && (
              <View
                style={[
                  styles.cardContainer,
                  {
                    width: `${
                      scrollWidth[0] / (scrollWidth[1] * scrollWidth[1])
                    }%`,
                  },
                ]}
              >
                <View style={styles.card}>
                  <DriverInfoForm
                    nextPage={update == null ? nextPage : setFormCompleted}
                    driver={driver}
                    zones={zones}
                    update={update}
                    navigation={navigation}
                    setShowAlert={setShowAlert}
                    isFirstTime={isFirstTime}
                  />
                  {update == null && (
                    <Bullets
                      numOfBulls={scrollWidth[1]}
                      index={0}
                      errorsIndex={errorsIndex}
                    />
                  )}
                </View>
              </View>
            )}
            {(update == "documents" || update == null) &&
              dataSource?.map((item, index) => (
                <View
                  style={[
                    styles.cardContainer,
                    {
                      width: `${
                        scrollWidth[0] / (scrollWidth[1] * scrollWidth[1])
                      }%`,
                    },
                  ]}
                  key={index}
                >
                  <View style={styles.card}>
                    <DriverDocumentForm
                      document={item}
                      documentsLength={dataSource.length}
                      previousPage={previousPage}
                      nextPage={nextPage}
                      index={index + 1}
                      setFormCompleted={setFormCompleted}
                      errorIndex={errorsIndex}
                      update={update}
                      driver={driver}
                      changeCounter={changeCounter}
                      setChangeCounter={setChangeCounter}
                      showAlert={showAlert}
                      setShowAlert={setShowAlert}
                    />
                    <Bullets
                      numOfBulls={scrollWidth[1]}
                      index={update == null ? index + 1 : index}
                      errorsIndex={errorsIndex}
                    />
                  </View>
                </View>
              ))}
          </ScrollView>
        </View>
        <InfoModal
          show={showSuccess}
          setShow={setShowSuccess}
          title={"Informacion de documentos"}
          message={"Los documentos se cargaron exitosamente"}
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
    </>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    alignItems: "center",
  },
  card: {
    paddingHorizontal: 22,
    paddingVertical: 16,
    borderRadius: 10,
    width: "95%",
    backgroundColor: "#fff",
  },
});
