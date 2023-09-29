import React, { useState, useEffect } from "react";

import AppContainerForm from "../../library/components/AppContainerForm";
import PasswordRecoveryForm from "../../library/forms/PasswordRecoveryForm";

export default function PasswordRecoveryView({ navigation }) {
  const [username, setUsername] = useState("+57");
  const [email, setEmail] = useState("");

  const formProps = { username, setUsername, setEmail, navigation };

  useEffect(() => {
    //! REDIRECCIONA A CONFIRMAR EL CODIGO DESPUES DE INGRESAR EL NUMERO
    if (email && username) {
      navigation.navigate("RecoveryPasswordSubmit", {
        username: username.replace(/\s/g, ""),
        email,
      });
    }
  }, [email, username]);

  return (
    <AppContainerForm navigation={navigation}>
      <PasswordRecoveryForm {...formProps} />
    </AppContainerForm>
  );
}
