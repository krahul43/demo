//* HOOK QUE BLOQUEA LA PANTALLA EN UNA DIRECCION Y LA LIBERA EN LAS SIGUIENTES
import {useState, useEffect} from 'react'
import * as ScreenOrientation from 'expo-screen-orientation';

export const useLockOrientation = (orientation=1) => {
  //* MAPEO DE LAS ORIENTACIONES DE NUMEROS A OBJETOS
  const screenOrientation = {
    1 : ScreenOrientation.OrientationLock.PORTRAIT_UP,
    2 : ScreenOrientation.OrientationLock.PORTRAIT_DOWN,
    3 : ScreenOrientation.OrientationLock.LANDSCAPE_LEFT,
    4 : ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT,
  }

  const [success, setSuccess] = useState(false);

  const lockScreen = () => setSuccess(true);

  const lockPortrait = async() => {
    await ScreenOrientation.lockAsync(screenOrientation[orientation]);
  }

  const unlockPortrait = async() => {
    await ScreenOrientation.unlockAsync();
  }

  useEffect(() => {
    lockPortrait();

    return () => unlockPortrait();
  },[])

  return {lockScreen}
}
