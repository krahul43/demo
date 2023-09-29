import React, { useEffect } from "react";
import { BackHandler } from "react-native";
import { useDispatch } from 'react-redux';
import AppContainerForm from '../../library/components/AppContainerForm';
import LoginForm from '../../library/forms/LoginForm';

import { getAuthenticatedUser } from '../../../configureAmplify';
import { setUserAWS } from '../../library/redux/actions/Auth.action';

//  console.log("\x1b[31m%s\x1b[0m" ,"I Am Using Yellow");

export default function LoginView({navigation}) {

  const dispatch = useDispatch();

  const verifyUserExistency = async () => { //! VERIFICA SI HAY UN USUARIO AWS EN EL POOL
    const aws_user_storage = await getAuthenticatedUser();
    if (aws_user_storage) dispatch(setUserAWS(aws_user_storage));
  };

  useEffect(() => { //! EFECTO QUE EJECUTA LA BUSQUEDA
    verifyUserExistency();
  }, [])

  useEffect(() => { //! CAPTURA DEL BOTON FISICO DE REGRESO
    const onBackPress = () => {
      return true
    };
    BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () => BackHandler.removeEventListener('hardwareBackPress');
  },[])

  const formProps = { navigation }

  return( 
    <AppContainerForm navigation={navigation} backButton={false}>
      <LoginForm {...formProps}/> 
    </AppContainerForm>  
  )
}