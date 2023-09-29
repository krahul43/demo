import React, { useState, useEffect } from "react";

import AppContainerForm from "../../library/components/AppContainerForm";
import SignupForm from "../../library/forms/SignupForm";

export default function SignupView({ navigation, route }) {
  const { type = "driver" } = route.params;

  const [user, setUser] = useState(null);
  const [password, setPassword] = useState("");
  const [dest, setDest] = useState("");

  const formProps = {
    setUser,
    setDest,
    password,
    setPassword,
    navigation,
    type,
  };

  useEffect(() => {
    //!REDIRECCIONA A CONFIRMAR EL CODIGO DESPUES DE INGRESAR LOS DATOS
    if (user && dest) {
      const { username } = user;
      navigation.navigate("ConfirmSignup", {
        username: username.replace(/\s/g, ""),
        password,
        dest: dest.replace(/\s/g, ""),
        type,
      });
    }
  }, [user, dest]);

  return (
    <AppContainerForm navigation={navigation}>
      <SignupForm {...formProps} />
    </AppContainerForm>
  );
}
