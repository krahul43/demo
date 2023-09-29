//* COMPONENTE QUE MUESTRA LOS MENSAJES DE ALERTA E INFORMACION (ANIMADOS)
import React, { useEffect, useRef } from "react";
import styled from "styled-components/native";
import { TouchableOpacity } from "react-native";
export { ScrollView, Alert } from "react-native";
import * as Animatable from "react-native-animatable";

import { isPortrait as p, hp, wp, useDimensions } from "../hooks/device.hooks";

//* ESTILOS DEL MENSAJE DE INFORMACION
export const InfoContainer = styled.View`
  width: 100%;
  border-left-width: 10px;
  border-left-color: #f2b215;
  border-radius: 10px;
  padding: 10px;
  margin-top: ${p ? hp(4) : wp(4)}px;
`;

//* ESTILOS DEL MENSAJE DE ERROR
export const ErrorContainer = styled.View`
  width: 100%;
  border-left-width: 10px;
  border-left-color: rgba(239, 83, 80, 0.5);
  border-radius: 10px;
  background-color: rgba(239, 83, 80, 0.05);
  padding: 10px;
  margin-top: ${p ? hp(4) : wp(4)}px;
`;

//* ESTILOS DEL TEXTO DEL MENSAJE
export const InfoText = styled.Text`
  color: #000;
  font-weight: bold;
  font-size: 16px;
`;

//* COMPONENTE DEL MENSAJE DE ERROR
export const ErrorMessage = ({ children, reload }) => {
  const { portrait: p, hp, wp } = useDimensions();
  const animationRef = useRef(null);

  //* SIEMPRE QUE HAY UN ERROR SE REINICIA LA ANIMACION, ESA INCIDENCIA DE ERROR SE RECIBE POR LAS PROPS (RELOAD)
  useEffect(() => {
    animationRef.current.shake(200);
  }, [reload]);

  return (
    <Animatable.View ref={animationRef}>
      <ErrorContainer
        style={{
          marginTop: p ? hp(1.5) : hp(3),
        }}
      >
        <InfoText>{children}</InfoText>
      </ErrorContainer>
    </Animatable.View>
  );
};

//* COMPONENTE DEL MENSAJE DE INFORMACION
export const InfoMessage = ({
  children,
  reload,
  onPress = null,
  containerStyle = {},
}) => {
  const { portrait: p, hp, wp } = useDimensions();
  const animationRef = useRef(null);

  useEffect(() => {
    animationRef.current.shake(200);
  }, [reload]);

  return (
    <Animatable.View ref={animationRef} style={containerStyle}>
      <>
        {onPress ? (
          <TouchableOpacity onPress={onPress} style={{ borderRadius: 10 }}>
            <InfoContainer
              style={{
                marginTop: p ? hp(2) : hp(2),
              }}
            >
              <InfoText>{children}</InfoText>
            </InfoContainer>
          </TouchableOpacity>
        ) : (
          <InfoContainer
            style={{
              marginTop: p ? hp(2) : hp(2),
            }}
          >
            <InfoText>{children}</InfoText>
          </InfoContainer>
        )}
      </>
    </Animatable.View>
  );
};
