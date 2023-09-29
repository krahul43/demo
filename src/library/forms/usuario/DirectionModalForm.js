import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, Modal, TextInput, TouchableOpacity} from 'react-native';
import { useTheme } from "react-native-paper";

import { ErrorMessage } from "../../components/Alert";

export default function DirectionModalForm(props){
  const {showModal,setShowModal, onConfirm, error, setError} = props
  const {colors: { primary }} = useTheme();

  const [directionLabel, setDirectionLabel] = useState('');

  useEffect(() => { //! PARA RESETEAR EL VALOR DEL INPUT
    setDirectionLabel('');
  },[showModal])

  return(
    <Modal visible={showModal} transparent={true} style={styles.modal} >
      <TouchableOpacity style={styles.modalContainer}>
        <View style={styles.modalContent}>
          
          <Text style={{...styles.title, borderBottomColor:primary}}>Añadir favorito</Text>
          <View style={styles.directionForm}>
            <View style={styles.formStep}>
              <Text style={styles.stepText}>Nombre</Text>
              <TextInput 
                style={{borderBottomWidth:2, paddingVertical:10, fontSize:16}} 
                onChangeText={(text) => setDirectionLabel(text)}  
              />
            </View>
          </View>
          {error && 
            <View style={styles.errorView}>
              <Text style={styles.errorText}>Ya existe una direccion registrada con ese nombre</Text>            
            </View>
          }

          <View style={styles.actionsView}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowModal(false)}>
              <Text style={[styles.buttonText,{color:'#fff'}]}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              disabled={directionLabel.length < 1} 
              style={{
                ...styles.confirmButton,
                backgroundColor: directionLabel.length < 1 ? '#ccc' : primary
              }} 
              onPress={() => {
                setError(false);
                onConfirm(directionLabel)
              }}
            >
              <Text style={styles.buttonText}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContainer:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent:{
    width:'80%',
    backgroundColor:'white',
    paddingHorizontal:20,
    paddingVertical:10,
    borderRadius:10,
  },
  title:{
    fontSize:17,
    fontWeight:'700',
    textAlign:'center',
    width:'100%',
    paddingBottom:5,
    borderBottomWidth:2,
  },
  directionForm:{
    marginTop:10,
    marginBottom:2
  },
  formStep:{
    marginBottom: 0
  },
  stepText:{
    fontSize:16,
    color:'grey',
    fontStyle:'italic'
  },
  actionsView:{
    marginTop:15,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between'
  },
  cancelButton:{
    borderWidth:1,
    borderRadius:4,
    paddingVertical:5,
    backgroundColor:'black',
    width:'45%',
    borderRadius:200
  },
  confirmButton:{
    width:'45%',
    paddingVertical:5,
    borderRadius:4,
    borderRadius:200
  },
  buttonText:{
    fontSize:17,
    textAlign:'center'
  },
  errorView:{
    //marginBottom:15
  },  
  errorText:{
    color:'red',
    fontSize:13,
    fontStyle:'italic'
  }
})