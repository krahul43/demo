import React from 'react';
import { useTheme } from "react-native-paper";
import { View, StyleSheet, Text } from 'react-native';
import * as Animatable from "react-native-animatable";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function AlertModal(props) {
  const { isVisible, closeFunction, text, icon } = props;

  const {colors: { primary }} = useTheme();

  return(
    <>
      {isVisible &&
        <Animatable.View 
          style={{...styles.container, borderColor:primary}}
          animation={'slideInDown'}
          duration={300}
        >
          <Icon name={icon ? icon : "wifi-off"} style={{marginRight:10}} size={30} color={'black'} />
          <View style={styles.infoView}>  
            <Text style={styles.subTitle}>
              {text ? text : 
                'Debes estar conectado a internet para continuar usando la aplicacion'
              }
            </Text>
          </View>
          <Icon name="close" style={styles.floatingClose} onPress={() => closeFunction()} size={15} color={'black'} />
        </Animatable.View>
      }
    </>
  )
}

const styles = StyleSheet.create({
  container:{
    position:'absolute',
    top:30,
    width:'90%',
    alignSelf:'center',
    backgroundColor:'white',
    flexDirection:'row',
    alignItems:'center',
    paddingHorizontal:10,
    paddingVertical:10,
    borderRadius:2,
    borderWidth:1
  },
  infoView:{
    flex:1,
  },
  title:{
    fontSize:17,
    fontWeight:'bold',
    marginBottom:5
  },
  floatingClose: {
    position:'absolute', 
    top:5, right:5, 
    padding:5
  }
})