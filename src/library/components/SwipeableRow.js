import React, {useRef} from 'react';
import {View, StyleSheet} from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function SwipeableRow(props) {
  //* children: EL CONTENIDO DE LA FILA - onDelete: FUNCION QUE DETERMINA QUE HACER AL PRESIONAR LA OPCION DESLIZABLE - index: ELEMENTO ACTUAL DE LA LISTA
  const {children, onDelete, index} = props
  const swipeableRef = useRef(null);

  //*ESTA ES LA VISTA QUE SE RENDERIZA AL HACER SWIPE A LA DERECHA, SE PUEDE HACER LO MISMO SI SE QUIERE CREAR A LA IZQUIERDA
  const renderRightAction = () => {
    return (
      <RectButton style={styles.rightAction} onPress={() => onDelete(index)} >
        <Icon 
          name="delete-forever"
          size={30}
          color="#fff"
          style={[styles.actionIcon]}
        />
      </RectButton>
    )
  }

  //*AQUI SE PUEDEN RENDERIZAR VARIOS BOTONES, EL WIDTH ES EL ANCHO TOTAL DISPONIBLE DE TODOS LOS BOTONES, EN ESTE CASO SOLO HAY UNA OPCION POR LO TANTO UN BOTON
  const renderRightActions = () => (
    <View style={styles.actionsContainer}>
      {renderRightAction()}
    </View>
  );

  //*LOS TreshHold SON LA DISTANCIA MAXIMA QUE SE DEBE DESLIZAR EL ITEM PARA QUE MANTENGAN LAS OPCIONES CORRESPONDIENTES - LOS Actions SON LAS VISTAS QUE SE MOSTRARAN SI SE DESLIZA EL ITEM
  return (
    <Swipeable 
      ref={swipeableRef}
      enabled={false}
      leftThreshold={100}
      rightThreshold={80}
      renderLeftActions={null}
      renderRightActions={() => renderRightActions()}
    >
      {children}
    </Swipeable>
  )
}

const styles = StyleSheet.create({
  actionIcon:{
    width:30,
    marginHorizontal:10,
  },
  rightAction: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: "#dd2c00",
    justifyContent: 'center',
  },
  actionsContainer:{
    flexDirection:'row', 
    width:80
  }
})