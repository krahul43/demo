import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput as Input } from "react-native-paper";
import _ from "lodash";

import ImageContainer from "../../components/ImageContainer";
import NavigateActions from "../../components/NavigateActions";
import Loading from "../../components/Loading";
import { TextInput } from "../../components/Input";
import { H2 } from "../../components/Typography";
import { ErrorMessage, InfoMessage } from "../../components/Alert";

import { sendDocument, updateInfo } from "../../networking/API";
import { useDimensions } from "../../hooks/device.hooks";

export default function DriverDocumentForm(props) {
  const {
    document,
    documentsLength,
    previousPage,
    nextPage,
    index,
    setFormCompleted,
    errorIndex,
    update,
    driver,
    changeCounter,
    setChangeCounter,
    showAlert,
    setShowAlert,
  } = props;

  const { portrait: p, hp, wp } = useDimensions();

  const [userDocument, setUserDocument] = useState(null);
  const [documentId, setDocumentId] = useState(
    document?.document_type_id || document?.id
  );
  const [inputValue, setInputValue] = useState(document?.value || "");
  const [image1, setImage1] = useState(document?.img1 || null);
  const [image2, setImage2] = useState(document?.img2 || null);
  const [imageKey1, setImageKey1] = useState(document?.img1Key || null);
  const [imageKey2, setImageKey2] = useState(document?.img2Key || null);
  const [documentTitle, setDocumentTitle] = useState(
    document?.DocumentType?.section_title || document?.section_title
  );

  const [documentSent, setDocumentSent] = useState(false);
  const [documentLoading, setDocumentLoading] = useState(false);
  const [error, setError] = useState(
    document?.Review?.status == 0 ? document?.Review.comments : ""
  );
  const [refreshError, setRefreshError] = useState(false);

  const isPlate = () => documentTitle.includes("laca");

  const checkErrors = () => {
    //! SE VERIFICAN ERRORES
    if (!isPlate()) {
      if (!inputValue || !image1 || !image2) {
        setError("Hay campos vacíos");
        setRefreshError(!refreshError);
        return true;
      }
    } else {
      if (inputValue.length < 6) {
        setError("Debes ingresar una placa valida");
        setRefreshError(!refreshError);
        return true;
      }
    }
  };

  const submitData = () => {
    //! SUBMIT
    if (checkErrors()) return;
    setError("");

    const data = {
      type: documentId,
      value: inputValue,
      img1Key: imageKey1,
      img2Key: imageKey2,
      img1: image1 != document?.img1 ? image1 : null,
      img2: image2 != document?.img2 ? image2 : null,
    };

    console.log(data);

    const hasChanged =
      update != "documents" ||
      Object.values(data).filter((property) => property == null).length < 2;

    if (errorIndex.includes(index) && !hasChanged) {
      setError("No puedes continuar sin corregir este documento");
      setRefreshError(!refreshError);
      return;
    }

    if (hasChanged) {
      setChangeCounter(changeCounter + 1);
      setUserDocument(data);
    } else {
      setUserDocument({});
    }
  };

  useEffect(() => {
    //! FORMULARIO COMPLETADO
    if (userDocument) {
      if (_.isEmpty(userDocument)) sendData(true);
      else sendData(false);
    }
  }, [userDocument]);

  const sendData = async (isEmpty) => {
    //! ENVIO DE DATOS
    setDocumentLoading(true);
    let documentsData = new FormData();
    const tempDocuments = { ...userDocument };
    for (const [key, value] of Object.entries(tempDocuments)) {
      if (value != null) documentsData.append(key, value);
    }

    if (index != documentsLength) {
      //! SI NO HA LLEGADO A LA ULTIMA VISTA
      if (isEmpty) {
        setDocumentLoading(false);
        setDocumentSent(true);
        return;
      } else {
        if (update == "documents") {
          documentsData.append("need_review", 1);
        } else {
          documentsData.append("should_update_review", 0);
        }
      }
    } else {
      //! ULTIMA VISTA
      if (changeCounter == 0 && update == "documents") {
        setDocumentLoading(false);
        setDocumentSent(true);
        return;
      }
      const updateRequest = new FormData();
      updateRequest.append("complete_info", 1);
      updateRequest.append("need_review", 1);
      try {
        //! ACTUALIZAR INFO DEL USUARIO
        await updateInfo(driver?.token, updateRequest);
        if (isEmpty) {
          setDocumentLoading(false);
          setDocumentSent(true);
          return;
        }
      } catch (error) {
        console.log(error);
        setShowAlert(true);
        return;
      }
    }

    try {
      //! ACTUALIZAR DOCUMENTOS
      await sendDocument(driver?.token, documentsData);
      setDocumentLoading(false);
      setDocumentSent(true);
    } catch (error) {
      console.log(error);
      setShowAlert(true);
      return;
    }
  };

  useEffect(() => {
    //! DOCUMENTO ENVIADO CON EXITO
    if (documentSent) {
      setDocumentSent(false);
      if (index == documentsLength) {
        setFormCompleted(true);
      } else {
        update == null ? nextPage(index + 1) : nextPage(index);
      }
    }
  }, [documentSent]);

  useEffect(() => {
    if (showAlert) {
      setDocumentLoading(false);
    }
  }, [showAlert]);

  return (
    <View>
      <H2 style={styles.title}>
        {document?.DocumentType?.section_title || document.section_title}
      </H2>

      <TextInput
        inputStyle={{
          placeholder:
            document?.DocumentType?.document_type || document.document_type,
          maxLength: isPlate() ? 6 : null,
          autoCapitalize: isPlate() ? "characters" : "none",
          value: inputValue,
          left: (
            <Input.Icon
              name={document?.DocumentType?.input_icon || document.input_icon}
              color={"grey"}
            />
          ),
          onChangeText: (text) => setInputValue(text),
        }}
      />

      {/*//*VERIFICO QUE EN ESA VISTA SE DEBAN AGREGAR IMAGENES */}
      {document.caption1 != "" && document?.DocumentType?.caption1 != "" && (
        <View style={[styles.row, { marginTop: hp(3) }]}>
          <ImageContainer
            imageStyles={{
              ...styles.image,
              width: p ? wp(35) : wp(28),
              height: p ? hp(15) : hp(45),
            }}
            imageProps={{ resizeMode: "contain" }}
            defaultImage={require("../../../../assets/no-image.png")}
            selectedImage={image1}
            setSelectedImage={setImage1}
            caption={document?.DocumentType?.caption1 || document.caption1}
          />
          <ImageContainer
            imageStyles={{
              ...styles.image,
              width: p ? wp(35) : wp(28),
              height: p ? hp(15) : hp(45),
            }}
            imageProps={{ resizeMode: "contain" }}
            defaultImage={require("../../../../assets/no-image.png")}
            selectedImage={image2}
            setSelectedImage={setImage2}
            caption={document?.DocumentType?.caption2 || document.caption2}
          />
        </View>
      )}

      {isPlate() && (
        <InfoMessage>
          Escribe el número de placa sin ningún guion (-) intermedio
        </InfoMessage>
      )}

      {error.length > 0 && (
        <ErrorMessage reload={refreshError}>{error}</ErrorMessage>
      )}

      <NavigateActions
        previousPage={previousPage}
        validateAndNext={submitData}
        length={documentsLength}
        index={index}
        firstTime={update == null}
      />
      <Loading isVisible={documentLoading} hasText={false} />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    alignSelf: "flex-start",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  image: {
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 2,
  },
});
