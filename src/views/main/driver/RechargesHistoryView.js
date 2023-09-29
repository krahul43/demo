//* VISTA DEL HISTORIAL DE RECARGAS
import React, {useState} from 'react'
import { FlatList, StyleSheet, View, Text } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useTheme } from "react-native-paper";

import AppContainerMap from "../../../library/components/AppContainerMap";
import { H2 } from '../../../library/components/Typography';

import { useDimensions } from "../../../library/hooks/device.hooks";

const dataTest = [
  {
    id:'1',
    date:'20-11-2020',
    time:'21:00',
    earn:'$15.000',
  },
  {
    id:'2',
    date:'20-11-2020',
    time:'21:00',
    earn:'$15.000',
  },
  {
    id:'3',
    date:'20-11-2020',
    time:'21:00',
    earn:'$15.000',
  },
  {
    id:'4',
    date:'20-11-2020',
    time:'21:00',
    earn:'$15.000',
  },
  {
    id:'5',
    date:'20-11-2020',
    time:'21:00',
    earn:'$15.000',
  }
]

export default function TripsMade({navigation, route}) {

  const [refills, setRefills] = useState(dataTest);
  const {portrait:p} = useDimensions();
  const {colors:{primary}} = useTheme();

  //* DISEÑO DEL HEADER
  const tripsHeader = () => (
    <View style={styles.header}>
      <Text style={{fontSize:16}}>VIAJES REALIZADOS</Text>
    </View>
  )

  //* DISEÑO DE LAS FILAS
  const listItem = (item,index) => {
    return (
      <RectButton style={styles.tile} >
        <View style={{flex:1}}>
          <Text style={styles.fromText}>{item.date}</Text>
          <Text style={styles.fromText}>{item.time}</Text>
        </View>
        <View style={styles.priceSeparator} />
        <View>
          <Text style={{fontSize:22}}>{item.earn}</Text>
        </View>
      </RectButton>
    )
  }
  return(
    <AppContainerMap
      navigation={navigation}
      backButton={true}
      drawerMenu={false}
    >
      <H2>Historial de recargas</H2>
      <FlatList
        contentContainerStyle={styles.listContainer}
        keyExtractor={(item) => item.id.toString()}
        data={refills}
        renderItem={({item,index}) => listItem(item,index)}
        ItemSeparatorComponent={() => <View style={{height:10}} />}
      />
    </AppContainerMap>
  )
}

const styles = StyleSheet.create({
  header:{
    alignSelf:'flex-start', 
    paddingHorizontal:20, 
    height:'100%', 
    justifyContent:'center'
  },
  listContainer:{
    marginTop:10, 
    paddingBottom:110
  },
  tile:{
    padding:20, 
    flexDirection:'row', 
    alignItems:'center',
    width: '95%',
    borderRadius:10,
    backgroundColor:'white',
    alignSelf:'center'
  },
  detailsSeparator: {
    width:'20%', 
    marginVertical:15,  
    borderWidth:1
  },
  detailsContainer:{
    flexDirection:'row', 
    width:'100%', 
    justifyContent:'space-between'
  },
  detailItem:{
    flexDirection:'row', 
    alignItems:'center'
  },
  priceSeparator:{
    height:'70%', 
    marginHorizontal:20, 
    borderColor:'#ddd', 
    borderWidth:1
  },
  fromText:{
    fontSize:16,
    marginBottom:10
  },
  toText:{
    fontSize:14
  }
})
