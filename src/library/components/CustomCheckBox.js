import  React, { useEffect, useRef } from "react";
import { StyleSheet, TouchableOpacity, Animated, Easing } from "react-native";

export function CustomCheckBox(
    {
      id,
      value,
      onValueChange,
      checkedColor, 
      uncheckedColor='black', 
    }
  ) {
    const animatedController = useRef(new Animated.Value(0)).current;

    const viewPadding = animatedController.interpolate({
      inputRange:[0,1],
      outputRange:[10,6]
    })

    const toogleButton = () => {
      if(value == id){
        Animated.timing(animatedController,{
          duration:300,
          toValue:1,
          easing: Easing.bezier(0.4, 0.0, 0.2, 1),
          useNativeDriver:false
        }).start()
      } else {
        Animated.timing(animatedController,{
          duration:300,
          toValue:0,
          easing: Easing.bezier(0.4, 0.0, 0.2, 1),
          useNativeDriver:false
        }).start()
      }
    }

    useEffect(() => {
      if(value != null){
        toogleButton()
      }
    },[value])

    return (
      <>
        <TouchableOpacity style={{
          ...styles.checkboxContainer,
          borderColor: value == id  ? checkedColor : uncheckedColor
          }}
          onPress={onValueChange}
        >
          <Animated.View 
            style={[styles.checkboxContent,
              {
                backgroundColor: value == id ? 'white' : uncheckedColor,
                padding: 9
              }
            ]}
          />
          <Animated.View 
            style={[styles.checkboxContent,
              {
                backgroundColor: value == id ? checkedColor : 'white',
                padding: viewPadding
              }
            ]}
          />
        </TouchableOpacity>
      </>
    )
}

const styles = StyleSheet.create({
  checkboxContainer:{
    alignSelf:'flex-start',
    borderWidth:2,
    borderRadius:50,
    backgroundColor:'white',
    padding:9,
    justifyContent:'center',
    alignItems:'center',
    overflow:'hidden'
  },
  checkboxContent:{
    position:'absolute',
    borderRadius:50,
  },
})