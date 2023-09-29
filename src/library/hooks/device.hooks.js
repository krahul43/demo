//* HOOK PARA OBTENER LAS DIMENSIONES DE LAS PANTALLAS Y REACCIONAR A LOS CAMBIOS DE ORIENTACION
import { useState, useEffect } from "react";
import { StyleSheet, Dimensions, Platform, PixelRatio } from "react-native";

export const useIsPortrait = () => {
  const [portrait, setPortrait] = useState(true);
  useEffect(() => {
    const setIsPortrait = () => setPortrait(isPortrait());
    setIsPortrait();
    Dimensions.addEventListener("change", setIsPortrait);
    return () => Dimensions.removeEventListener("change", setIsPortrait);
  }, []);

  return portrait;
};

export const isPortrait = () => {
  const { height, width } = Dimensions.get("window");
  return height >= width;
};

export const useDimensions = () => {
  const portrait = useIsPortrait();
  const tablet = isTablet();
  const [width, setWidth] = useState(deviceWidth());
  const [height, setHeight] = useState(deviceHeight());
  useEffect(() => {
    setWidth(deviceWidth());
    setHeight(deviceHeight());
  }, [portrait]);

  return {
    width,
    height,
    hp,
    wp,
    portrait,
    landscape: !portrait,
    tablet,
    phone: !tablet,
  };
};

export const useResponsiveStyles = (
  stylesCallback = ({
    portrait,
    wp,
    hp,
    width,
    height,
    landscape,
    tablet,
    phone,
  }) => ({}),
  nStyles = {}
) => {
  const {
    portrait = true,
    width,
    height,
    landscape = false,
    tablet = false,
    phone = true,
  } = useDimensions();

  const Styles = () =>
    StyleSheet.create(
      stylesCallback({
        wp,
        hp,
        portrait,
        width,
        height,
        landscape,
        tablet,
        phone,
      })
    );
  const [styles, setStyles] = useState(Styles());

  useEffect(() => {
    setStyles(Styles());
  }, [portrait]);

  return { ...styles, ...nStyles };
};

const percentage = (num, per) => (num / 100) * per;

export const deviceWidth = () => Dimensions.get("window").width;
export const deviceHeight = () => Dimensions.get("window").height;

export const wp = (per) => {
  return percentage(deviceWidth(), per);
};

export const hp = (per) => {
  return percentage(deviceHeight(), per);
};

const msp = (dim, limit) => {
  const { scale, width, height } = dim;
  return scale * width >= limit || scale * height >= limit;
};

export const isTablet = () => {
  const dim = Dimensions.get("window");
  const { scale } = dim;
  return (scale < 2 && msp(dim, 1000)) || (scale >= 2 && msp(dim, 1900));
};

export const isPhone = () => !isTablet();

export function normalize(size) {
  const {
    width: SCREEN_WIDTH,
  } = Dimensions.get('window');
  const scale = SCREEN_WIDTH / 320;
  const newSize = size * scale 
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize))
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
  }
}