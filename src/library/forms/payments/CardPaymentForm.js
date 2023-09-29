import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Text, ScrollView, Alert } from "react-native";
import axios from "axios";
import RNPickerSelect from "react-native-picker-select";
import { useSelector } from "react-redux";
import Icon from "react-native-vector-icons/FontAwesome";
import i18n from "i18n-js";
import { Tooltip } from "react-native-elements";
import { useDispatch } from "react-redux";
import { useNetInfo } from "@react-native-community/netinfo";
import useRegisterPaymentTransaction from "../../hooks/request/drivers/payment/useRegisterPaymentTransaction.hooks";
import { setPaymentAction } from "../../redux/actions/taxista/activePaymentAction";

import Loading from "../../../library/components/Loading";
import { Title } from "../../components/Typography";
import { BorderInput } from "../../components/Input";
import { SubmitButton } from "../../components/Button";

import { useDimensions } from "../../hooks/device.hooks";
import { setInternetState } from "../../redux/actions/internetAction";

const cardsIcons = {
  VISA: "cc-visa",
  MASTERCARD: "cc-mastercard",
  AMEX: "cc-amex",
  DINERS: "cc-diners-club",
};

export default function PsePaymentForm(props) {
  const { navigation, amount } = props;
  const { driver } = useSelector(({ driverReducer }) => driverReducer);
  const { wp, hp } = useDimensions();
  const dateTooltipRef = useRef(null);
  const ccvTooltipRef = useRef(null);
  const dispatch = useDispatch();
  const { isConnected } = useNetInfo();

  const [basicAuth, setBasicAuth] = useState(
    "Basic M2U3MzJiNzdmMTNiNjQ0OTNhOTQxYjBhNTE4ZmZiNGE6NWFlNjE5N2Y0Y2Y4YjU3NzQ3MWQ4OTk1MzFkOTdkMTU="
  );
  const [numDoc, setNumDoc] = useState("");
  const [name, setName] = useState(driver.user.first_name);
  const [lastName, setLastName] = useState(driver.user.last_name);
  const [selectDues, setSelectDues] = useState(1);
  const [mesV, setMesV] = useState("");
  const [anoV, setAnoV] = useState("");
  const [cvv, setCvv] = useState("");
  const [successPayment, setSuccessPayment] = useState(null);
  const [keyPublic, setKeyPublic] = useState(
    "pub_prod_gsTpJopFdLvzWZLl1r7OFSPR6QrYpFsX"
  );
  const [keyPrivate, setKeyPrivate] = useState(
    "prv_prod_nD3KTDZ8PwU1y3KG1sW20TAwfK3jfGCj"
  );
  // const [keyPublic, setKeyPublic] = useState(
  //   "pub_test_5X4E8ck5OMSHbbdReYztFpsSVyABdmWL"
  // );
  // const [keyPrivate, setKeyPrivate] = useState(
  //   "prv_test_hBUjtKWnBcAiQbgWTQEOSHs3hVGbkzR5"
  // );
  const {
    loadingRegisterTransaction,
    errorRegisterTransaction,
    registerTransaction,
  } = useRegisterPaymentTransaction();
  const [numTarjeta, setNumTarjeta] = useState("");
  const [result, setResult] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const setActivePayment = (payment) => dispatch(setPaymentAction(payment));
  const [dues, setDues] = useState([
    {
      key: 1,
      label: "1",
      value: 1,
      inputLabel: "1",
    },
    {
      key: 2,
      label: "2",
      value: 2,
      inputLabel: "2",
    },
  ]);

  const notConnected = () => dispatch(setInternetState(false));

  // const detectCardType = async (number) => {
  //   //! DETECTA EL TIPO DE TARJETA (SOLO CUANDO COLOCA LOS 16 DIGITOS)
  //   if (number.length > 18) {
  //     let selectData = "";
  //     var re = {
  //       VISA: /^4[0-9]{12}(?:[0-9]{3})?$/,
  //       MASTERCARD: /^5[1-5][0-9]{14}$/,
  //       AMEX: /^3[47][0-9]{13}$/,
  //       DINERS: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
  //     };
  //     const card = number.split(" ").join("");
  //     for (var key in re) {
  //       if (re[key].test(card)) {
  //         selectData = key;
  //       }
  //     }
  //     console.log("tarjeta: ", selectData);
  //     setResult(selectData.toString());
  //   } else {
  //     setResult("");
  //   }
  // };

  const cardFormatter = (text) => {
    //! FORMATO PARA EL CAMPO DE TARJETA
    let formattedText = text.split(" ").join("");
    if (formattedText.length > 0) {
      formattedText = formattedText.match(new RegExp(".{1,4}", "g")).join(" ");
    }
    console.log(formattedText);
    setNumTarjeta(formattedText);
  };

  const valueFormatter = (value, unformated = false) => {
    //! FORMATO PARA LA CANTIDAD
    if (value) {
      if (unformated) {
        return value.replace(/[.]/g, "");
      }
      const unformatValue = value.replace(/[.]/g, "");
      return i18n.toNumber(parseInt(unformatValue), {
        precision: 0,
        separator: ",",
        delimiter: ".",
      });
    } else {
      return "";
    }
  };

  const getApiToken = async () => {
    try {
      const result = await axios.get(
        //! OBTIENE EL TOKEN  PARA LAS PETICIONES
        `https://production.wompi.co/v1/merchants/${keyPublic}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setToken(result.data.data.presigned_acceptance.acceptance_token);
    } catch (error) {
      console.error("api token error", error);
      throw error;
    }
  };

  const TCToken = async () => {
    //! ENVIO DE DATOS
    setLoading(true);
    let numberTC = numTarjeta.split(" ").join("");
    if ((name, lastName, numTarjeta, mesV, anoV, cvv, selectDues != "")) {
      try {
        const result = await axios.post(
          "https://production.wompi.co/v1/tokens/cards",
          {
            number: numberTC,
            cvc: cvv,
            exp_month: mesV,
            exp_year: anoV,
            card_holder: name + lastName,
          },
          {
            headers: {
              Authorization: "Bearer " + keyPublic,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );
        paymentSource(result.data.data.id);
      } catch (error) {
        setLoading(false);
        console.log("ERROR TARJETA", error);
      }
    } else {
      setLoading(false);
      Alert.alert(
        "Falta Información",
        "Por favor diligencia todos los campos.",
        [{ text: "Ok" }]
      );
    }
  };

  const paymentSource = async (tcToken) => {
    try {
      const result = await axios.post(
        "https://production.wompi.co/v1/payment_sources",
        {
          type: "CARD",
          token: tcToken,
          acceptance_token: token,
          customer_email: driver.user.email,
        },
        {
          headers: {
            Authorization: "Bearer " + keyPrivate,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      sendData(tcToken, result.data.data.id);
    } catch (error) {
      setLoading(false);
      console.log("ERROR TARJETA", error);
    }
  };

  const sendData = async (tcToken, sourceId) => {
    try {
      const result = await axios.post(
        "https://production.wompi.co/v1/transactions",
        {
          acceptance_token: token,
          amount_in_cents: amount * 100,
          currency: "COP",
          customer_email: driver.user.email,
          payment_method: {
            type: "CARD",
            token: tcToken,
            installments: selectDues,
          },
          payment_source_id: sourceId,
          redirect_url: "https://www.taxizoneapp.com/",
          reference: Math.floor(100000 + Math.random() * 900000).toString(),
          customer_data: {
            phone_number: driver.user.phone_number,
            full_name: name + lastName,
          },
        },
        {
          headers: {
            Authorization: "Bearer " + keyPrivate,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      setLoading(false);
      console.log(result.data.data);
      const { data } = result;
      const res_ = await registerTransaction({ data });
      setActivePayment(res_);
      setSuccessPayment(result.data.data);
    } catch (error) {
      setLoading(false);
      console.log("ERROR TARJETA", error);
    }
  };

  useEffect(() => {
    if (successPayment) {
      navigation.navigate("Wallet");
    }
  }, [successPayment]);

  useEffect(() => {
    getApiToken();
    const beforeRemoveSubscription = navigation.addListener(
      "beforeRemove",
      () => {
        setSuccessPayment(null);
      }
    );

    return () => beforeRemoveSubscription();
  }, []);

  return false ? (
    <Loading isVisible={true} hasText={false} />
  ) : (
    <ScrollView contentContainerStyle={styles.container}>
      <Title style={styles.title}>Completar Pago con tarjeta</Title>
      <View style={styles.amountView}>
        <Text style={styles.amountText}>Cantidad a recargar:</Text>
        <Text style={styles.amountValue}>${valueFormatter(amount)}</Text>
      </View>

      <View style={styles.paymentForm}>
        <View style={styles.rechargeStep}>
          <Text style={styles.stepText}>Nombre del titular</Text>
          <BorderInput
            inputProps={{
              placeholder: "Nombre",
              value: name,
              onChangeText: (text) => setName(text),
            }}
            containerStyle={{
              marginTop: 4,
            }}
          />
        </View>
        <View style={styles.rechargeStep}>
          <Text style={styles.stepText}>Apellido del titular</Text>
          <BorderInput
            inputProps={{
              placeholder: "Apellido",
              value: lastName,
              onChangeText: (text) => setLastName(text),
            }}
            containerStyle={{
              marginTop: 4,
            }}
          />
        </View>

        <View style={styles.rechargeStep}>
          <Text style={styles.stepText}>Número de Tarjeta y Cuotas</Text>
          <View style={styles.row}>
            <BorderInput
              inputProps={{
                placeholder: "Nº Tarjeta",
                value: numTarjeta,
                onChangeText: (text) => {
                  cardFormatter(text); //detectCardType(text),
                },
                keyboardType: "number-pad",
              }}
              containerStyle={{
                marginTop: 4,
                width: wp(70),
              }}
            />
            <RNPickerSelect
              placeholder={{}}
              onValueChange={(value) => setSelectDues(value)}
              items={dues}
              style={{
                inputIOS: [styles.inputPickerIOS],
                inputIOSContainer: [
                  styles.containerPickerIOS,
                  { width: wp(15) },
                ],
                inputAndroid: [styles.inputPickerAndroid],
                inputAndroidContainer: [
                  styles.containerPickerAndroid,
                  { width: wp(15) },
                ],
                placeholder: styles.pickerPlaceHolder,
              }}
              useNativeAndroidPickerStyle={false}
              Icon={() => <Icon name="caret-down" size={18} />}
            />
          </View>
        </View>

        <View style={styles.rechargeStep}>
          <Text style={styles.stepText}>Informacion de la tarjeta</Text>
          <View style={styles.cardInfoView}>
            <View style={styles.expirationView}>
              <View style={styles.expirationDate}>
                <BorderInput
                  inputProps={{
                    placeholder: "MM",
                    value: mesV,
                    onChangeText: (text) => setMesV(text),
                    keyboardType: "number-pad",
                    maxLength: 2,
                  }}
                  containerStyle={{
                    marginTop: 4,
                    flex: 0.4,
                  }}
                />
                <Text style={styles.dateSeparator}>/</Text>
                <BorderInput
                  inputProps={{
                    placeholder: "YY",
                    value: anoV,
                    onChangeText: (text) => setAnoV(text),
                    keyboardType: "number-pad",
                    maxLength: 2,
                  }}
                  containerStyle={{
                    marginTop: 4,
                    flex: 0.4,
                  }}
                />
                <Icon
                  name="info-circle"
                  size={20}
                  style={{ marginLeft: 5 }}
                  onPress={() => dateTooltipRef.current.toggleTooltip()}
                />
              </View>
            </View>
            <View style={styles.ccvView}>
              <View
                style={{ ...styles.expirationDate, justifyContent: "flex-end" }}
              >
                <BorderInput
                  trailing={
                    <Icon
                      name="credit-card"
                      size={20}
                      style={{ marginRight: 3 }}
                    />
                  }
                  inputProps={{
                    placeholder: "CCV",
                    value: cvv,
                    onChangeText: (text) => setCvv(text),
                    keyboardType: "number-pad",
                    maxLength: 4,
                  }}
                  containerStyle={{
                    alignSelf: "flex-end",
                    marginTop: 4,
                    flex: 0.5,
                  }}
                />
                <Icon
                  name="info-circle"
                  size={20}
                  style={{ marginLeft: 5 }}
                  onPress={() => ccvTooltipRef.current.toggleTooltip()}
                />
              </View>
            </View>
          </View>
        </View>

        <Tooltip
          ref={dateTooltipRef}
          containerStyle={{ marginTop: -10, marginLeft: wp(16) }}
          withOverlay={false}
          withPointer={false}
          backgroundColor="#ddd"
          width={160}
          popover={
            <Text style={{ textAlign: "center" }}>Fecha de vencimiento</Text>
          }
        />

        <Tooltip
          ref={ccvTooltipRef}
          containerStyle={{ marginTop: -10, marginLeft: wp(40) }}
          withOverlay={false}
          withPointer={false}
          width={160}
          backgroundColor="#ddd"
          popover={
            <Text style={{ textAlign: "center" }}>Codigo de verificacion</Text>
          }
        />
      </View>

      <SubmitButton
        buttonStyle={{ marginVertical: hp(2) }}
        loading={loadingRegisterTransaction}
        onPress={() => (!isConnected ? notConnected() : TCToken())}
      >
        CONTINUAR CON EL PAGO
      </SubmitButton>
      <Loading isVisible={loading} hasText={false} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
    paddingBottom: 10,
  },
  title: {
    textAlign: "center",
    marginVertical: 10,
  },
  amountView: {
    //marginHorizontal:10,
    paddingBottom: 6,
    borderBottomWidth: 2,
    borderBottomColor: "#F2B215",
  },
  amountText: {
    color: "grey",
  },
  amountValue: {
    fontSize: 20,
    marginVertical: 3,
    color: "black",
    fontWeight: "800",
  },
  paymentForm: {
    //marginHorizontal:10,
    marginVertical: 10,
  },
  rechargeText: {
    fontSize: 18,
    fontStyle: "italic",
  },
  rechargeStep: {
    marginVertical: 10,
  },
  stepText: {
    color: "grey",
    fontSize: 16,
    fontStyle: "italic",
  },
  cardInfoView: {
    flexDirection: "row",
    alignItems: "center",
  },
  expirationView: {
    flex: 0.5,
  },
  ccvView: {
    flex: 0.5,
  },
  expirationDate: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateSeparator: {
    marginHorizontal: 5,
    color: "grey",
    fontSize: 18,
  },
  row: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  expirationView: {
    flex: 0.5,
  },
  ccvView: {
    flex: 0.5,
  },
  expirationDate: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateSeparator: {
    marginHorizontal: 5,
    color: "grey",
    fontSize: 18,
  },
  row: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputPickerAndroid: {
    color: "black",
    fontSize: 18,
  },
  containerPickerAndroid: {
    borderBottomWidth: 2,
    //paddingLeft:5,
    paddingVertical: 2,
    marginTop: 5,
    //alignItems:'center',
    justifyContent: "center",
  },
  inputPickerIOS: {
    color: "black",
    fontSize: 18,
  },
  containerPickerIOS: {
    borderBottomWidth: 2,
    //paddingLeft:5,
    paddingVertical: 2,
    marginTop: 5,
    //alignItems:'center',
    justifyContent: "center",
  },
  pickerPlaceHolder: {
    fontSize: 18,
  },
});
