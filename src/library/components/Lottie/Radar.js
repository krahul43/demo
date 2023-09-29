import React from "react";
import LottieView from "lottie-react-native";

export default () => {
  return (
    <LottieView
      autoPlay={true}
      duration={1000}
      loop={true}
      style={{
        flex: 1,
      }}
      source={require("../../../../assets/lottie/pulse.json")}
    />
  );
};
