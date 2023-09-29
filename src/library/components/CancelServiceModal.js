import React, { useState } from 'react';
import { View, StyleSheet, Text, Modal, TouchableOpacity } from 'react-native';
import { useTheme } from "react-native-paper";

import { BorderInput } from "./Input";
import { CustomCheckBox } from "./CustomCheckBox";
import { Keyboard } from 'react-native';

export default function CancelServiceModal(props){
  const { showModal,setShowModal, onConfirm, options } = props
  const { colors: { primary } } = useTheme();

  const [selectedOption, setSelectedOption] = useState(null);
  const [customReason, setCustomReason] = useState('');

  return(
    <Modal visible={showModal} animationType='slide' transparent={true} >
      <TouchableOpacity style={styles.modalContainer} onPress={() =>Keyboard.dismiss()}>
        <View style={styles.modalContent}>
          <Text style={{...styles.title}}>Confirmación de cancelación</Text>
          <Text style={{...styles.body}}>
            Para nosotros es importante conocer las razones por las cuales desea cancelar el servicio, por favor
            seleccione la opcion que corresponda con su caso, con esto podemos mejorar el servicio prestado:   
          </Text>

          <View style={styles.optionsView}>
            {
              options.map((item,index) => 
              <TouchableOpacity style={styles.row} onPress={() => setSelectedOption(item)} >
                <CustomCheckBox 
                  id={item}
                  key={index.toString()}
                  value={selectedOption}
                  onValueChange={() => setSelectedOption(item)}
                  checkedColor={primary}
                />
                <Text style={styles.rowText}>{item}</Text>
              </TouchableOpacity>
              )
            }
          </View>

          {
            selectedOption == options.slice(-1) && 
              <BorderInput 
                inputProps={{
                  value:customReason,
                  onChangeText:(text) => setCustomReason(text),
                  placeholder:'Especifica tu motivo',
                }}
                inputStyle={{
                  fontSize:16
                }}
              />
          }

          <View style={styles.actionsView}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowModal(false)}>
              <Text style={[styles.buttonText,{color:'#fff'}]}>Volver</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={{
                ...styles.confirmButton,
                backgroundColor: primary
              }} 
              onPress={() => {
                onConfirm()
              }}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
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
    width:'90%',
    backgroundColor:'white',
    paddingHorizontal:20,
    paddingVertical:10,
    borderRadius:8,
  },
  title:{
    fontSize:18,
    fontWeight:'bold',
    width:'100%',   
  },
  body:{
    fontSize:16,
    fontStyle:'italic',
    textAlign:'justify',
    width:'100%',
    paddingVertical:10
  },
  optionsView:{
    marginBottom:5
  },
  row:{
    flexDirection:'row',
    alignItems:'center',
    paddingVertical:6
  },
  rowText:{
    fontSize:16,
    marginLeft:10
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
})