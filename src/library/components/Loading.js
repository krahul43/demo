import React from 'react'
import { StyleSheet, Modal, ActivityIndicator, TouchableOpacity, Text } from 'react-native'

export default function Loading(props) {
  const { isVisible, hasText=true } = props

  return (
    <Modal
      visible={isVisible} 
      animationType={'none'}
      transparent={true}>
      <TouchableOpacity style={styles.modalContainer} onPress={() => {}}>
        <TouchableOpacity style={[styles.modalContent]} onPress={() => {}}>
          <ActivityIndicator color={'rgba(242,178,21,0.4)'} size='large' />
        </TouchableOpacity>
        {hasText && (
        <Text style={styles.modalText}>
          Cargando información...
        </Text>
        )}
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor:'rgba(0,0,0,0.1)',
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent:{
    backgroundColor: 'rgba(242,178,21,0.15)',
    borderRadius: 200,
    padding:35,
  },
  modalText:{
    fontSize:16, 
    fontWeight:'bold'
  }
})