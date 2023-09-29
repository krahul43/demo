import React from 'react';

import AppContainerMap from "../../../../library/components/AppContainerMap";
import PsePaymentForm from "../../../../library/forms/payments/PsePaymentForm";

export default function paymentPseView({navigation,route:{params}}){

  const formProps={navigation,amount:params.amount}

  return(
    <AppContainerMap
      navigation={navigation}
      backButton={true}
      drawerMenu={false}
    > 
      <PsePaymentForm {...formProps}/>
    </AppContainerMap>
  )
}