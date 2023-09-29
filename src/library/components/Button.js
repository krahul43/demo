//*COMPONENTE QUE CREA BOTONES PERSONALIZADOS PARA LOS INPUT, TOMANDO COMO PLANTILLA UN BOTON DE UNA LIBRERIA
import React from "react";
import { TouchableOpacity, StyleSheet, Text } from "react-native";
import { Button } from "react-native-paper";
import { useTheme } from "react-native-paper";

import { useDimensions, normalize } from "../hooks/device.hooks";

//*EL TEMA SE ESPECIFICA EN AL APP.JS
export const LinkButton = (props) => {
  const { portrait: p, hp, wp } = useDimensions();
  return (
    <Button
      {...props}
      labelStyle={{ fontSize: p ? normalize(hp(2)) : normalize(wp(2)) }}
    />
  );
};

export const SubmitButton = ({ buttonStyle, labelStyle, ...props }) => {
  const { portrait: p, hp, wp } = useDimensions();
  return (
    <Button
      {...props}
      style={{ ...styles.defultSubmit, ...buttonStyle }}
      labelStyle={{
        fontSize: p ? normalize(hp(2)) : normalize(wp(2)),
        ...labelStyle,
      }}
      theme={useTheme()}
      mode="contained"
    />
  );
};

//! El ripple solo funciona si este boton esta fuera de un modal
export const FlatButton = ({
  containerStyle,
  text,
  textStyle,
  onPress,
  icon = null,
  iconButton = false,
}) => {
  return (
    <TouchableOpacity
      style={{
        ...styles.container,
        //borderRadius: iconButton ? 200 : 0,
        ...containerStyle,
      }}
      onPress={onPress}
    >
      {icon != null && icon}
      {iconButton && !text ? null : (
        <Text style={{ marginLeft: icon ? 10 : null, ...textStyle }}>
          {text}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  defultSubmit: {
    width: "80%",
    alignSelf: "center",
    zIndex: 0,
  },
  container: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
});
