import React from "react";
import { View } from "react-native";

import AppContainerForm from "../../library/components/AppContainerForm";
import { SubmitButton } from "../../library/components/Button";
import { H2 } from "../../library/components/Typography";
import { useDimensions } from "../../library/hooks/device.hooks";

export default function RegisterOptionsView({ navigation }) {
  const { hp } = useDimensions();

  return (
    <AppContainerForm navigation={navigation}>
      <View>
        <H2>¿Como quieres registrarte?</H2>
        <View style={{ marginVertical: hp(6) }}>
          <SubmitButton
            onPress={() => navigation.navigate("Signup", { type: "client" })}
            buttonStyle={{ marginVertical: 10 }}
          >
            COMO USUARIO
          </SubmitButton>
          <SubmitButton
            onPress={() => navigation.navigate("Signup", { type: "porter" })}
            buttonStyle={{ marginVertical: 10 }}
          >
            COMO PORTERO
          </SubmitButton>
          <SubmitButton
            onPress={() => navigation.navigate("Signup", { type: "driver" })}
            buttonStyle={{ marginVertical: 10 }}
          >
            COMO CONDUCTOR
          </SubmitButton>
        </View>
      </View>
    </AppContainerForm>
  );
}
