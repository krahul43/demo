import React from 'react';
import { View, StyleSheet } from 'react-native';

//*numOfBulls: NUMERO DE PUNTOS A DIBUJAR, *index: PAGINA ACTUAL
export default function Bullets(props) {
  const { numOfBulls, index, errorsIndex } = props

  let bullets = [];
  
  //*SI EL INDEX DEL PUNTO COINCIDE CON EL DE LA PAGINA ACTUAL ESTE SE PINTA DE OTRO COLOR, ASI MISMO SI EL INDEX COINCIDE CON UNA PAGINA QUE CONTIENE ERRORES SE CAMBIA EL COLOR DEL BORDE
  for (let i = 0; i < numOfBulls; i++) {
    bullets.push(
      <View key={i} style={[styles.bullet, 
        {
          backgroundColor: i == index ? "#F2B215" : "#fff",
          borderColor:  errorsIndex.includes(i) ? "red" : 'black' 
        }]} />
    )  
  }

  return(
    <View style={styles.bulletsContainer}>
      {bullets}
    </View>
  )
}

const styles = StyleSheet.create({
  bulletsContainer:{
    alignItems:'center',
    flexDirection:'row',
    marginTop:25,
    width:'50%',
    justifyContent:'space-between',
    alignSelf:'center'
  },
  bullet:{
    padding:5,
    borderRadius: 10,
    borderColor:'grey',
    borderWidth:1
  },
})