import React from 'react';

import AppContainerForm from '../../library/components/AppContainerForm'
import ChangePasswordForm from '../../library/forms/ChangePasswordForm';

export default function ChangePasswordView({navigation}) {
  return(
    <AppContainerForm navigation={navigation}>
      <ChangePasswordForm />
    </AppContainerForm>
  )
}