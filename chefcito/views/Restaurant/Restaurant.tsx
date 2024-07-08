import { Button, StyleSheet, Text, View,Image,ScrollView,SafeAreaView  } from 'react-native';
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView centerContent={true}>
          <Image source={{uri:`data:image/jpeg;base64,${restaurant.image}`}} style={styles.MainImage}/>
          <View style={styles.InfoContainer}>
              <Text style={styles.Name}>{restaurant.name}</Text>
          </View>
          <View>
            <Text style={styles.Location}>{restaurant.location}</Text>
            {/*Temporal despues reemplazar por un mapa de verdad*/}
            <Image source={img} style={styles.Image} />
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
  }
});
