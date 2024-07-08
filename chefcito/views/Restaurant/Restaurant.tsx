import { Button, StyleSheet, Text, View,Image,ScrollView,SafeAreaView, Pressable, Platform, Linking  } from 'react-native';
import NewBooking from "../../components/NewBooking/NewBooking"
import { useState } from 'react';
import {NewBookingModel,NewBookingPost} from "../../models/NewBooking.model";
import {GetUser} from "../../hooks/getUser.hook";
import {PostBooking} from "../../api/bookings";
const img = require('../../assets/images/wendys_ubicacion.png')
export default function Restaurant({route, navigation}) {
  const {
    user,
  } = GetUser()
  const {restaurant} = route.params;
  const [showNewBooking,setShowNewBooking] = useState(false)

  const cancel = () =>{
    setShowNewBooking(false)
  }

  const accept = async (value:NewBookingModel) =>{
    setShowNewBooking(false)
    const data:NewBookingPost = {
      ...value,
      venue:restaurant.id
    }
    try {
      const result = await PostBooking(data,user)
      if(result){
        console.log('reserva creada',result)
      }
    } catch(err) {
      console.log("error",err)
    } 
  }

  const openMaps = () => {
    const fullAddress = restaurant.location
    const url = Platform.select({
      ios: `maps:0,0?q=${fullAddress}`,
      android: `geo:0,0?q=${fullAddress}`,
    })
    
    Linking.openURL(url)
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView centerContent={true}>
          <Image source={{uri:`data:image/jpeg;base64,${restaurant.image}`}} style={styles.MainImage}/>
          <View style={styles.InfoContainer}>
              <Text style={styles.Name}>{restaurant.name}</Text>
          </View>
          <View>
            <Pressable onPress={openMaps} style={styles.mapButton}><Text style={styles.Location}>Abrir ubicacion en el mapa</Text></Pressable>
            {/*Temporal despues reemplazar por un mapa de verdad*/}
            {/* <Image source={img} style={styles.Image} /> */}
          </View>
          <View style={styles.ButtonContainer}>
            <Button title='Hacer una Reserva' onPress={()=>setShowNewBooking(true)} />
          </View>
          <NewBooking show={showNewBooking} cancel={cancel} accept={accept} />
        </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal:8
  },
  MainImage: {
    width:'100%',
    height:150,
  },
  Name:{
    fontSize:25,
    fontWeight:'700',
    textAlign:'center'
  },
  Location:{
    textAlign:'center'
  },
  InfoContainer:{
  },
  Image:{
    height:300,
  },
  ButtonContainer:{
    marginTop:12
  },
  mapButton:{
    borderRadius:8,
    borderWidth:2,
    borderColor:'gray',
    marginTop:8
  }
});
