import React from 'react';

import AppContainerMap from '../../../../library/components/AppContainerMap';
import RechargeForm from "../../../../library/forms/payments/RechargeForm";

export default function WalletView({navigation, route}) {
 
  return(
    <AppContainerMap navigation={navigation} drawerMenu={false} backButton={true} >
      <RechargeForm navigation={navigation} route={route}></RechargeForm>
    </AppContainerMap>
  );
}