import React from "react";

import AppContainerForm from '../../library/components/AppContainerForm'
import ChangePhoneForm from "../../library/forms/ChangePhoneForm"

export default function ChangePhoneView({navigation}) {
  return(
    <AppContainerForm navigation={navigation} >
      <ChangePhoneForm navigation={navigation}/>
    </AppContainerForm>
  )
}