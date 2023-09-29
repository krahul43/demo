import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Alert, Modal, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from "react-native-paper";
import { ReactNativeFile } from 'extract-files';

import { useDimensions } from "../hooks/device.hooks";

export default function ImageContainer (props) {
  const { selectedImage, setSelectedImage, caption, imageProps, imageStyles, defaultImage } = props
  const { portrait: p, wp } = useDimensions();
  const {colors: { primary }} = useTheme();

  const [showOptions, setShowOptions] = useState(false);
  const [actualImage, setActualImage] = useState(selectedImage || null);
  
   const getPermission = async (source) =>{ //! OBTENER LOS PERMISOS DE LA CAMARA U GALERIA
    let response;
    if(source == 0){
      response = await ImagePicker.getCameraRollPermissionsAsync();
      if(response.status !== 'granted') {
        response = await ImagePicker.requestCameraRollPermissionsAsync();
      } 
    } else {
      response = await ImagePicker.getCameraPermissionsAsync();
      if(response.status !== 'granted') {
        response = await ImagePicker.requestCameraPermissionsAsync();
      }
    }
    return response.status === 'granted' ? true : false
  }

  const setImage = async (source) =>{ //! FUNCION QUE CAPTURA LA IMAGEN DEPENDIENDO DE LA FUENTE SELECCIONADA
    const permission = await getPermission(source);
    if(permission){
      let imageTaked  
      if(source == 0){
        imageTaked = await ImagePicker.launchImageLibraryAsync({
          aspect:[4,3],
          quality:0.7
        });
      } else {
        imageTaked = await ImagePicker.launchCameraAsync({
          aspect:[4,3],
          quality:0.7
        }) 
      } 

      if(imageTaked.cancelled){
        setShowOptions(false)
        return Alert.alert(
          'Seleccion cancelada',
          'No se agrego ninguna imagen',
          [
            {text:'Continuar'}
          ]
        )
      }

      const index = imageTaked.uri.lastIndexOf('/');
      const imgInfo = imageTaked.uri.substring(index+1)
      const ext = imgInfo.split('.')[1]

      const file = new ReactNativeFile({
        uri: imageTaked.uri,
        name: imgInfo,
        type: 'image/'+ext
      })

      setActualImage(imageTaked.uri)
      setSelectedImage(file)
      setShowOptions(false)
    } else {
      Alert.alert(
        'Permisos requeridos',
        'Debes aceptar los permisos para adjuntar una iamgen',
        [{text:'Continuar'}]
      )
      return setShowOptions(false);
    }
  }

  return(
    <TouchableOpacity onPress={() => setShowOptions(true)}>
      <Image 
        source={actualImage ? {uri:actualImage} : defaultImage}
        {...imageProps}
        style={{...imageStyles}}
        //resizeMode="contain"
      />
      {caption && <Text style={styles.captionText}>{caption}</Text>}
      <Modal
        visible={showOptions} 
        animationType={'slide'}
        transparent={true}>
        <TouchableOpacity style={styles.modalContainer} onPress={() => setShowOptions(false)}>
          <TouchableOpacity style={[styles.modalContent,{width: p ? wp(80) : wp(45), borderColor:primary}]} onPress={() => {}}>
            <View style={{...styles.modalTitle, borderBottomColor:primary}}>
              <Text style={styles.modalText}>
                Completar acción usando  
              </Text> 
            </View>
            <View style={styles.optionsRow}>
              <TouchableOpacity onPress={() => setImage(0)}>
                <Image 
                  //?resizeMode={'contain'} --> PROBAR RESPONSIVE
                  source={require('../../../assets/gallery.png')}
                  style={{width: p ? 75 : 90, height: p ? 75 : 90}}
                />
                <Text style={styles.sourceText}>
                  Galerìa
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setImage(1)}>
                <Image 
                  //?resizeMode={'contain'} --> PROBAR RESPONSIVE
                  source={require('../../../assets/camera.png')}
                  style={{width: p ? 75 : 90, height: p ? 75 : 90}}
                />
                <Text style={styles.sourceText}>
                  Càmara
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  captionText: {
    textAlign:'center', 
    color:'grey', 
    marginTop:5, 
    fontSize: 15
  },
  modalContainer: {
    backgroundColor:'rgba(0,0,0,0.5)',
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent:{
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical:15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth:2
  },
  optionsRow: {
    flexDirection:'row',
    justifyContent:'space-between',
    paddingVertical:20,
    width:'75%'
  },
  modalTitle: {
    borderBottomWidth:2
  },
  modalText:{
    fontSize:18,
    marginVertical:15,
  },
  sourceText:{
    fontSize:14, 
    textAlign:'center', 
  }
});