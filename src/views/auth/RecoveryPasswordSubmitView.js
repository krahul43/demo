import React from "react";

import AppContainerForm from "../../library/components/AppContainerForm";
import RecoveryPasswordCodeForm from "../../library/forms/RecoveryPasswordCodeForm";

export default function RecoveryPasswordSubmitView({ navigation, route }) {
  const { username, email, reSend = false } = route.params;

  const formProps = { username, email, navigation, reSend };

  return (
    <AppContainerForm navigation={navigation} preventExit={true}>
      <RecoveryPasswordCodeForm {...formProps} />
    </AppContainerForm>
  );
}
