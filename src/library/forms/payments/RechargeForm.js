import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { TextInput as Input, IconButton } from "react-native-paper";
import * as Animatable from "react-native-animatable";
import _ from "lodash";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import i18n from "i18n-js";
import { useDispatch, useSelector } from "react-redux";
import { useNetInfo } from "@react-native-community/netinfo";
import { useTheme } from "react-native-paper";
import useGetActivePayment from "../../hooks/request/drivers/payment/useGetActivePayment.hooks";
import useGetUserWalletBallance from "../../hooks/request/drivers/payment/useGetUserWalletBallance.hooks";

import {
  setPaymentAction,
  setPaymentLoadingAction,
} from "../../redux/actions/taxista/activePaymentAction";

import { SubmitButton } from "../../components/Button";
import { TextInput } from "../../components/Input";
import { Title } from "../../components/Typography";

import { useDimensions } from "../../../library/hooks/device.hooks";
import { setInternetState } from "../../redux/actions/internetAction";
import { setActiveServiceAction } from "../../redux/actions/activeService.action";

export default function RechargeForm({ navigation, route }) {
  const { portrait: p, wp, hp } = useDimensions();
  const dispatch = useDispatch();
  const { isConnected } = useNetInfo();
  const {
    colors: { primary },
  } = useTheme();

  const [rechargeValue, setRechargeValue] = useState("");
  const [methodSelected, setMethodSelected] = useState(null);
  const [animationType1, setAnimationType1] = useState(null);
  const [animationType2, setAnimationType2] = useState(null);
  const [transactionMessage, setTransactionMessage] = useState(false);
  const [clearActiveService, setClearActiveService] = useState(false);
  const setActivePayment = (payment) => dispatch(setPaymentAction(payment));

  const {
    error,
    loading: loading_user_balance,
    getUserWalletBalance,
  } = useGetUserWalletBallance();

  const {
    driverReducer: { driver },
    activePaymentReducer,
  } = useSelector(({ driverReducer, activePaymentReducer }) => ({
    driverReducer,
    activePaymentReducer,
  }));
  const { wallet_balance } = driver?.user || {};
  const {
    getPayment,
    loading: lodingGetPayment,
    error: errorGetPayment,
  } = useGetActivePayment();
  const { data: activePayment, loading: loadingActivePayment } =
    activePaymentReducer || {};
  const { status, id: activePaymentId } = activePayment || {};

  const activePaymentState =
    status == "PENDING"
      ? "Pendiente"
      : status == "APPROVED"
      ? "Aprobada"
      : status == "DECLINED"
      ? "Rechazada"
      : null;
  const transactionIndicatorColor =
    status == "PENDING"
      ? "#F7DC6F"
      : status == "APPROVED"
      ? "#A9DFBF"
      : status == "DECLINED"
      ? "#F5B7B1"
      : null;

  const zoomIn = {
    0: {
      scale: 1,
    },
    1: {
      scale: 1.2,
    },
  };

  const zoomOut = {
    0: {
      scale: 1.2,
    },
    1: {
      scale: 1,
    },
  };

  const notConnected = () => dispatch(setInternetState(false));

  const valueFormatter = (value, unformated = false) => {
    //! FORMATO PARA EL INPUT DE CANTIDAD
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

  const consultActivePaymentState = async () => {
    await getUserWalletBalance();
    if (!activePaymentId) return;
    const { status } = await getPayment(activePaymentId);
    if (status == "PENDING") return;
    else {
      setActivePayment({ ...activePayment, status });
      setClearActiveService(true);
    }
  };

  const continueWithPayment = () => {
    if (!isConnected) {
      notConnected();
    } else {
      if (parseInt(valueFormatter(rechargeValue, true)) < 5000) {
        return Alert.alert(
          "Valor a recargar",
          "La recarga debe ser mayor a $5.000",
          [{ text: "Ok" }]
        );
      }
      methodSelected == 0
        ? navigation.navigate("PayPse", {
            amount: valueFormatter(rechargeValue, true),
          })
        : navigation.navigate("PayCard", {
            amount: valueFormatter(rechargeValue, true),
          });
    }
  };

  useEffect(() => {
    //! ANIMACION
    if (route?.params?.transaction != undefined) {
      setTransactionMessage(true);
      setMethodSelected(null);
      setAnimationType1(null);
      setAnimationType2(null);
      setRechargeValue("");
    }
  }, [route]);

  useEffect(() => {
    if (clearActiveService) setTimeout(() => setActivePayment(null), 8000);
  }, [clearActiveService]);

  useEffect(() => {
    const subscription = navigation.addListener("focus", () => {
      setTransactionMessage(true);
      setMethodSelected(null);
      setAnimationType1(null);
      setAnimationType2(null);
      setRechargeValue("");
      consultActivePaymentState();
      setClearActiveService(false);
    });

    // const beforeRemoveSubscription = navigation.addListener(
    //   "beforeRemove",
    //   () => {
    //     setClearActiveService(false);
    //   }
    // );

    return () => {
      if (clearActiveService) setActivePayment(null);
      subscription();
      // beforeRemoveSubscription();
    };
  }, []);

  return (
    <ScrollView>
      <Title style={styles.title}>Mi billetera</Title>
      <IconButton
        disabled={lodingGetPayment || loading_user_balance}
        icon="refresh"
        size={24}
        onPress={() => consultActivePaymentState()}
        style={{ position: "absolute", right: 20, top: 10, zIndex: 10 }}
      />

      <View style={{ ...styles.balanceView, borderBottomColor: primary }}>
        {wallet_balance != null && (
          <View>
            <Text style={styles.balanceText}>Saldo disponible:</Text>
            {lodingGetPayment || loading_user_balance ? (
              <ActivityIndicator
                size="small"
                color="#000"
                style={{ marginVertical: 10, marginLeft: -24 }}
              />
            ) : (
              <Text style={styles.balanceValue}>
                ${valueFormatter(`${wallet_balance}`)}
              </Text>
            )}
          </View>
        )}

        {activePayment && (
          <View
            style={[
              styles.transactionMessageView,
              { backgroundColor: transactionIndicatorColor },
            ]}
          >
            <Icon name="alert-circle-outline" style={{ marginRight: 5 }} />
            <Text style={{ fontSize: 12 }}>
              Transacción {activePaymentState}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.paymentForm}>
        <Text style={styles.rechargeText}>Realizar una recarga</Text>
        <View style={styles.rechargeStep}>
          <Text style={styles.stepText}>Indique el monto a recargar</Text>
          <TextInput
            inputStyle={{
              label: "Valor",
              keyboardType: "numeric",
              value: rechargeValue,
              left: <Input.Icon name="currency-usd" color={"grey"} />,
              onChangeText: (text) => {
                const formatValue = valueFormatter(text);
                console.log(formatValue);
                setRechargeValue(formatValue);
              },
            }}
          />
        </View>
        <View style={styles.rechargeStep}>
          <Text style={styles.stepText}>Seleccione la forma de pago</Text>
          <View style={styles.paymentMethodView}>
            <Animatable.View animation={animationType1} duration={200}>
              <TouchableOpacity
                style={styles.paymentMethod}
                onPress={() => {
                  setMethodSelected(0);
                  if (_.isEqual(animationType2, zoomIn)) {
                    setAnimationType2(zoomOut);
                    setAnimationType1(zoomIn);
                  } else {
                    setAnimationType1(zoomIn);
                  }
                }}
              >
                <Icon
                  name={methodSelected == 0 ? "check-circle-outline" : null}
                  style={[styles.checkStyle, { left: 15 }]}
                  size={18}
                  color="#5dbf5b"
                />
                <Image
                  source={require("../../../../assets/pse.png")}
                  style={{ width: wp(30), height: hp(11) }}
                  resizeMode="contain"
                />
                <Text style={styles.paymentMethodCaption}>PSE</Text>
              </TouchableOpacity>
            </Animatable.View>
            <Animatable.View animation={animationType2} duration={200}>
              <TouchableOpacity
                style={styles.paymentMethod}
                onPress={() => {
                  setMethodSelected(1);
                  if (_.isEqual(animationType1, zoomIn)) {
                    setAnimationType1(zoomOut);
                    setAnimationType2(zoomIn);
                  } else {
                    setAnimationType2(zoomIn);
                  }
                }}
              >
                <Icon
                  name={methodSelected == 1 ? "check-circle-outline" : null}
                  style={[styles.checkStyle, { left: -5 }]}
                  size={18}
                  color="#5dbf5b"
                />
                <Image
                  source={require("../../../../assets/credit-card.png")}
                  style={{ width: wp(30), height: hp(11) }}
                  resizeMode="contain"
                />
                <Text style={styles.paymentMethodCaption}>TARJETA</Text>
              </TouchableOpacity>
            </Animatable.View>
          </View>
        </View>
        <SubmitButton
          buttonStyle={{ marginTop: hp(4) }}
          //loading={loading}
          disabled={methodSelected == null || !rechargeValue}
          onPress={() => continueWithPayment()}
        >
          CONTINUAR CON EL PAGO
        </SubmitButton>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    marginHorizontal: 15,
    marginVertical: 10,
    zIndex: 1,
    width: "70%",
  },
  balanceView: {
    position: "relative",
    marginHorizontal: 10,
    paddingBottom: 6,
    borderBottomWidth: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  balanceText: {
    color: "grey",
  },
  balanceValue: {
    fontSize: 20,
    marginVertical: 3,
    color: "black",
    fontWeight: "800",
  },
  paymentForm: {
    marginHorizontal: 10,
    marginVertical: 20,
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
  },
  paymentMethodView: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginTop: 15,
  },
  paymentMethod: {},
  checkStyle: {
    position: "absolute",
  },
  paymentMethodCaption: {
    textAlign: "center",
    fontSize: 12,
    color: "grey",
    fontWeight: "900",
  },
  transactionMessageView: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 5,
    paddingVertical: 5,
    backgroundColor: "#80DEEA",
    borderRadius: 15,
    minWidth: 40,
  },
});
