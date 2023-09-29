import React from 'react';

import AppContainerMap from "../../../../library/components/AppContainerMap";
import CardPaymentForm from "../../../../library/forms/payments/CardPaymentForm";

export default function paymentCreditCardView({navigation,route:{params}}){

  const formProps={navigation,amount:params.amount}

  return(
    <AppContainerMap
      navigation={navigation}
      backButton={true}
      drawerMenu={false}
    >
      <CardPaymentForm {...formProps}/>
    </AppContainerMap>
  )
}