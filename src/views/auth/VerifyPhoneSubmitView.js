import React, { useEffect } from 'react';
import { Auth } from "aws-amplify";

import AppContainerForm from '../../library/components/AppContainerForm'
import VerifyPhoneSubmitForm from '../../library/forms/VerifyPhoneSubmitForm'

export default function VerifyPhoneSubmitView({navigation,route}) {
  const { username, loged } = route.params;

  const formProps = { username, navigation, loged }

  useEffect(() => { //! SI NO ESTA LOGEADO SE RE-ENVIA EL MENSAJE DE CONFIRMACION
    if(!loged){
      Auth.verifyCurrentUserAttribute('phone_number')
      .catch((error) => console.log(error))
    }
  }, [loged])

  return (
    <AppContainerForm navigation={navigation} preventExit={true}>
      <VerifyPhoneSubmitForm {...formProps} />
    </AppContainerForm>
  )
}