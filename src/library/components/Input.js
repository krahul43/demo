//* COMPONENTE QUE CREA INPUTS PERSONALIZADOS, TOMANDO COMO PLANTILLA UN INPUT DE UNA LIBRERIA
import React, { useState } from "react";
import { TextInput as Input } from "react-native-paper";
import { View, StyleSheet, TextInput as NativeInput } from 'react-native';
import { useTheme } from "react-native-paper";

import { hp } from "../hooks/device.hooks";

//* COMO A UN VIEW SOLO SE LE MODIFICA EL ESTILO SOLO SE LE MODIFICA ESA PROPIEDAD
export const TextInput = ({inputStyle , containerStyle}) => {
  return (
    <View  style={{marginTop:hp(1.5),...containerStyle}}>
      <Input {...inputStyle} dense={true} mode="outlined" style={{...styles.defaultTextInput, ...inputStyle.style}} />
    </View>
  );
};

export const BorderInput = ({inputProps, inputStyle, containerStyle, leading=null, trailing=null}) => {
  const [isfocus, setIsFocus] = useState(false);
  const {colors: { primary }} = useTheme();

  return(
    <View style={{
      ...styles.container, 
      borderBottomColor: isfocus ? primary : 'black',
      ...containerStyle
    }}>
      {leading != null && (
        leading
      )}
      <NativeInput
      underlineColorAndroid="transparent"
      {...inputProps}
      style={{
        ...styles.defaultInput,
        ...inputStyle
      }}
      onFocus={() => setIsFocus(true)}
      onBlur={() => setIsFocus(false)}
      />
      {trailing != null && (
        trailing
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  defaultTextInput:{
    fontSize:18, 
    width:'100%', 
    backgroundColor:'#fff'
  },
  container:{
    borderBottomWidth:2,
    paddingBottom:4,
    flexDirection:'row',
    alignItems:'center'
  },
  defaultInput:{
    flex:1,
    fontSize:18,
  }
})

 

 
