import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, ScrollView, Alert } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import axios from "axios";
import * as Linking from "expo-linking";
import { useSelector, useDispatch } from "react-redux";
import Icon from "react-native-vector-icons/FontAwesome";
import i18n from "i18n-js";
import { useNetInfo } from "@react-native-community/netinfo";
import { setPaymentAction } from "../../redux/actions/taxista/activePaymentAction";

import Loading from "../../../library/components/Loading";
import { Title } from "../../components/Typography";
import { BorderInput } from "../../components/Input";
import { SubmitButton } from "../../components/Button";
import useRegisterPaymentTransaction from "../../hooks/request/drivers/payment/useRegisterPaymentTransaction.hooks";
import { useDimensions } from "../../hooks/device.hooks";
import { setInternetState } from "../../redux/actions/internetAction";
import { result } from "lodash";

export default function PsePaymentForm(props) {
  const { navigation, amount } = props;
  const {
    driverReducer: { driver },
    activePaymentReducer,
  } = useSelector(({ driverReducer, activePaymentReducer }) => ({
    driverReducer,
    activePaymentReducer,
  }));
  const { data: activePayment, loading: loadingActivePayment } =
    activePaymentReducer || {};

  const { wp, hp } = useDimensions();
  const dispatch = useDispatch();
  const setActivePayment = (payment) => dispatch(setPaymentAction(payment));
  const { isConnected } = useNetInfo();

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
  const [phone, setPhone] = useState(driver.user.phone_number);
  const [numDoc, setNumDoc] = useState("");
  const [name, setName] = useState(driver.user.first_name);
  const [lastName, setLastName] = useState(driver.user.last_name);
  const [documentTypes, setDocumentTypes] = useState([
    {
      key: "CC",
      label: "Cedula de Ciudadanía",
      value: "CC",
      inputLabel: "CC",
    },
    {
      key: "NIT",
      label: "NIT",
      value: "NIT",
      inputLabel: "NIT",
    },
  ]);
  const [personTypes, setPersonType] = useState([
    {
      key: 0,
      label: "Persona Natural",
      value: 0,
      inputLabel: "Natural",
    },
    {
      key: 1,
      label: "Persona Jurídica",
      value: 1,
      inputLabel: "Jurídica",
    },
  ]);
  const [docType, setDocType] = useState("CC");
  const [perType, setPerType] = useState(0);
  const [banks, setBanks] = useState(null);
  const [selectBank, setSelectBank] = useState("");
  const [successPayU, setSuccessPayU] = useState(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");

  const {
    loadingRegisterTransaction,
    errorRegisterTransaction,
    registerTransaction,
  } = useRegisterPaymentTransaction();

  const notConnected = () => dispatch(setInternetState(false));

  const valueFormatter = (value, unformated = false) => {
    //! FORMATO PARA EL VALOR
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

  useEffect(() => {
    getApiToken();
  }, []);

  const getBanks = async () => {
    //! OBTIENE LOS BANCOS
    try {
      console.log("TOKEN BANKS", token);
      const banks = await axios.get(
        "https://production.wompi.co/v1/pse/financial_institutions",
        {
          headers: {
            Authorization: "Bearer " + keyPublic,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(banks.data);
      let banksInfo = [];
      banks.data.data.map(function (info) {
        banksInfo.push({
          key: info.financial_institution_code,
          label: info.financial_institution_name,
          value: info.financial_institution_code,
        });
      });
      setBanks(banksInfo);
      setSelectBank(banksInfo[0].value);
    } catch (error) {
      console.error("banks error", error);
      throw error;
    }
  };

  const getInitialData = async () => {
    //! OBTIENE LOS VALORE INICIALES
    try {
      await getBanks();
      //await getDocumentTypes();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (token) {
      getInitialData();
    }
  }, [token]);

  const sendData = async () => {
    //! ENVIO DE DATOS
    setLoading(true);
    console.log({ token, selectBank, numDoc, perType, docType, numDoc, phone });
    if ((selectBank, name, lastName, docType, phone, numDoc != "")) {
      try {
        const result = await axios.post(
          "https://production.wompi.co/v1/transactions",
          {
            acceptance_token: token,
            amount_in_cents: amount * 100,
            bank: selectBank,
            currency: "COP",
            customer_email: driver.user.email,
            payment_method: {
              type: "PSE",
              user_type: perType,
              user_legal_id_type: docType,
              user_legal_id: numDoc,
              financial_institution_code: selectBank,
              payment_description: "Pago a TaxiZone",
            },
            // redirect_url: "https://www.taxizoneapp.com/",
            redirect_url: "https://www.taxizoneapp.com/",
            reference: Math.floor(100000 + Math.random() * 900000).toString(),
            customer_data: {
              phone_number: phone,
              full_name: name + " " + lastName,
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
        const { data } = result;
        const res_ = await registerTransaction({ data });
        setActivePayment(res_);
        getURL(result.data.data.id);
      } catch (error) {
        setLoading(false);
        console.log("ERROR", error);
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

  const getURL = async (data) => {
    try {
      const result = await axios.get(
        "https://production.wompi.co/v1/transactions/" + data,
        {},
        {
          headers: {
            Authorization: "Bearer " + keyPrivate,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      setLoading(false);
      setSuccessPayU(result.data.data.payment_method.extra.async_payment_url);
    } catch (error) {
      setLoading(false);
      console.log("ERROR", error);
    }
  };
  useEffect(() => {
    (async () => {
      //! SI EL ENVIO DE DATOS FUE EXITOSO
      if (successPayU != null) {
        Linking.openURL(successPayU);
        navigation.navigate("Wallet");
      }
    })();
  }, [successPayU]);

  return banks == null || documentTypes == null ? (
    <Loading isVisible={true} hasText={false} />
  ) : (
    <ScrollView contentContainerStyle={styles.container}>
      <Title style={styles.title}>Completar Pago con PSE</Title>
      <View style={styles.amountView}>
        <Text style={styles.amountText}>Cantidad a recargar:</Text>
        <Text style={styles.amountValue}>${valueFormatter(amount)}</Text>
      </View>

      <View style={styles.paymentForm}>
        <View style={styles.rechargeStep}>
          <Text style={styles.stepText}>Selecciona tu banco</Text>
          <RNPickerSelect
            placeholder={{}}
            onValueChange={(value) => setSelectBank(value)}
            items={banks}
            style={{
              inputIOS: [styles.inputPickerIOS],
              inputIOSContainer: [styles.containerPickerIOS],
              inputAndroid: [styles.inputPickerAndroid],
              inputAndroidContainer: [styles.containerPickerAndroid],
              placeholder: styles.pickerPlaceHolder,
            }}
            useNativeAndroidPickerStyle={false}
            Icon={() => (
              <Icon name="caret-down" size={18} style={{ paddingRight: 5 }} />
            )}
          />
        </View>

        <View style={styles.rechargeStep}>
          <Text style={styles.stepText}>Nombre</Text>
          <BorderInput
            inputProps={{
              placeholder: "Nombre",
              value: name,
              onChangeText: (text) => setName(text),
            }}
            inputStyle={{
              marginTop: 4,
            }}
          />
        </View>
        <View style={styles.rechargeStep}>
          <Text style={styles.stepText}>Apellido</Text>
          <BorderInput
            inputProps={{
              placeholder: "Apellido",
              value: lastName,
              onChangeText: (text) => setLastName(text),
            }}
            inputStyle={{
              marginTop: 4,
            }}
          />
        </View>

        <View style={styles.rechargeStep}>
          <Text style={styles.stepText}>Tipo y numero de documento</Text>
          <View style={styles.row}>
            <RNPickerSelect
              placeholder={{}}
              onValueChange={(value) => setDocType(value)}
              items={documentTypes}
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
            <BorderInput
              inputProps={{
                value: numDoc,
                placeholder: "No. de documento",
                onChangeText: (text) => setNumDoc(text),
              }}
              containerStyle={{
                marginTop: 4,
                width: wp(70),
              }}
            />
          </View>
        </View>

        <View style={styles.rechargeStep}>
          <Text style={styles.stepText}>Tipo de persona</Text>
          <RNPickerSelect
            placeholder={{}}
            onValueChange={(value) => setPerType(value)}
            items={personTypes}
            style={{
              inputIOS: [styles.inputPickerIOS],
              inputIOSContainer: [styles.containerPickerIOS],
              inputAndroid: [styles.inputPickerAndroid],
              inputAndroidContainer: [styles.containerPickerAndroid],
              placeholder: styles.pickerPlaceHolder,
            }}
            useNativeAndroidPickerStyle={false}
            Icon={() => (
              <Icon name="caret-down" size={18} style={{ paddingRight: 5 }} />
            )}
          />
        </View>

        <View style={styles.rechargeStep}>
          <Text style={styles.stepText}>Numero de telefono</Text>
          <BorderInput
            inputProps={{
              placeholder: "Numero",
              value: phone,
              onChangeText: (text) => setPhone(text),
            }}
            inputStyle={{
              marginTop: 4,
            }}
          />
        </View>
      </View>

      <SubmitButton
        buttonStyle={{ marginVertical: hp(2) }}
        disabled={loading || loadingRegisterTransaction}
        loading={loading || loadingRegisterTransaction}
        onPress={() => (!isConnected ? notConnected() : sendData())}
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
