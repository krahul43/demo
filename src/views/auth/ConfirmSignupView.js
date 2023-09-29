import React, { useState, useEffect } from "react";

import AppContainerForm from "../../library/components/AppContainerForm";
import ConfirmSignupForm from "../../library/forms/ConfirmSignupForm";

import { resendSignUpConfirm } from "../../library/hooks/SignupConfirm.hooks";

export default function ConfirmSignupView({ navigation, route }) {
  const { reSend, username, password, email } = route.params;

  const [destination, setDestination] = useState(null);

  const sendCode = async (sendOption = "sms") => {
    try {
      const { ok } = await resendSignUpConfirm(username, sendOption);
      if (ok) {
        setDestination(
          sendOption === "sms"
            ? username
            : sendOption === "email"
            ? email
            : null
        );
      }
    } catch (error) {}
  };

  const formProps = {
    destination,
    username,
    password,
    navigation,
    sendCode,
    email,
  };
  useEffect(() => {
    //! REENVIA EL CODIGO SI ES NECESARIO Y SETEA EL NUMERO DE TELEFONO DEL INPUT
    if (reSend && username) sendCode();
  }, []);

  return (
    <AppContainerForm navigation={navigation} preventExit={true}>
      <ConfirmSignupForm {...formProps} />
    </AppContainerForm>
  );
}
