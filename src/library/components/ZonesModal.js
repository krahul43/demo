import React from 'react'
import { View, StyleSheet, Text, Modal, ScrollView } from 'react-native';
import { List } from 'react-native-paper';

import { wp } from '../hooks/device.hooks';

export default function AlertModal(props) {
  //*CONTROL DE LA VISIBILIDAD, LA INFORMACION Y EL ESTADO DEL PADRE PARA SETEARLA
  const { show, setShow, data, setZone } = props

  return(
    <Modal visible={show} transparent={true}>
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, {width:wp(80)}]}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Selecciona tu zona</Text>
          </View>
          <View style={styles.separator} />
          <ScrollView>
            {data.map((item,index) => (
              <List.Item
                key={index}
                title={item.zone}
                onPress={() => {
                  setZone(item);
                  setShow(false);
                }}
              />
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContainer:{
    flex:1,
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent:{
    borderRadius:0,
    backgroundColor:'#fff'
  },
  titleContainer:{
    paddingVertical:10,
    alignItems:'center'
  },
  title:{
    fontSize:18,
    fontWeight:'800'
  },
  separator:{
    width:'100%',
    height:2,
    backgroundColor:'#eee',
    marginVertical:0
  },  
  item:{
    paddingHorizontal:10,
    paddingVertical:15,
    backgroundColor:'red',
    borderBottomColor:'black',
    borderBottomWidth:1
  }
})