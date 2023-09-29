import React from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import LottieView from 'lottie-react-native';

export default function LottieModal (props) {

  const { showModal=false, redirect, error = false } = props

  return(
    <Modal
    animationType="slide"
    visible={showModal}
    transparent={true}
    >
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <View>
          <LottieView
            autoPlay={true}
            duration={800}
            loop={false}
            style={{
              width: 100,
              height: 200,
            }}
            source={error ? require('../../../assets/lottie/error.json') : require('../../../assets/lottie/check.json')}
            onAnimationFinish={() => redirect()}
          />
        </View>
      </View>
    </View>
  </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
})
