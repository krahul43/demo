import React from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { useNetInfo } from "@react-native-community/netinfo";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useDimensions } from "../hooks/device.hooks";
import { setInternetState } from '../redux/actions/internetAction';

export default function NavigateActions(props) {
  const { previousPage, validateAndNext, length, index, firstTime } = props
  const { hp } = useDimensions();
  const dispatch = useDispatch();
  const { isConnected } = useNetInfo();

  const notConnected = () => dispatch(setInternetState(false));

  return (
    <>
      <View style={[styles.row,{marginTop: hp(3)}]}>
        {firstTime ? (
          <TouchableOpacity onPress={() => previousPage(index)}>
            <View>
              <Text style={styles.actionText}>
                Volver
              </Text>
            </View>
            <Icon name="arrow-left" size={40} color={"#F2B215"}/>
          </TouchableOpacity>
        ) : (index != 1) ? (
          <TouchableOpacity onPress={() => previousPage(index-1)}>
            <View>
              <Text style={styles.actionText}>
                Volver
              </Text>
            </View>
            <Icon name="arrow-left" size={40} color={"#F2B215"}/>
          </TouchableOpacity>
        ) : (
          <View></View>
        )}
        <TouchableOpacity onPress={() => !isConnected ? notConnected() : validateAndNext()}>
          <View>
            <Text style={styles.actionText}
            >
              {index == length ? "Finalizar" : "Continuar"}
            </Text>
          </View>
          <Icon name="arrow-right" size={40} color={"#F2B215"} style={{alignSelf:'flex-end'}}/>
        </TouchableOpacity>
      </View>  
    </>
  )
}

const styles = StyleSheet.create({
  actionText:{
    fontWeight:'bold',
    fontSize:18,
    textAlign:'right'
  },
  row:{
    flexDirection:'row', 
    justifyContent:'space-between'
  }
})