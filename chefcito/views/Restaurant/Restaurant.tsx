import { Button, StyleSheet, Text, View,Image,ScrollView,SafeAreaView, Pressable, Platform, Linking  } from 'react-native';
import NewBooking from "../../components/NewBooking/NewBooking"
import { useRef, useState } from 'react';
import {NewBookingModel,NewBookingPost} from "../../models/NewBooking.model";
import {GetUser} from "../../hooks/getUser.hook";
import {PostBooking} from "../../api/bookings";
import {WendysImage} from "../../models/Restauran.model";
import Loader from '../../components/Loader/Loader';
import ImageCarrousel from '../../components/ImageCarrousel/ImageCarrousel';
const wendys = require('../../assets/images/wendys.jpg')
export default function Restaurant({route, navigation}) {
 
  const {
    user,
  } = GetUser()
  const {restaurant} = route.params;
  const [showNewBooking,setShowNewBooking] = useState(false)
  const [loading,setLoading] = useState(false)

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
      setLoading(true)
      const result = await PostBooking(data,user)
      setLoading(false)
      if(result){
        console.log('reserva creada',result)
      }
    } catch(err) {
      setLoading(false)
      console.log("error",err)
    } 
  }

  const openMaps = () => {
    const fullAddress = '-34.5070944,-58.542399'
    const url = Platform.select({
      ios: `maps:0,0?q=${fullAddress}`,
      android: `geo:0,0?q=${fullAddress}`,
    })
    
    Linking.openURL(url)
  }

  const _renderItem = ({item,index}) => {
    return (
      <View style={{
          backgroundColor:'floralwhite',
          borderRadius: 5,
          height: 250,
          padding: 50,
          marginLeft: 25,
          marginRight: 25, }}>
        <Text style={{fontSize: 30}}>{item.title}</Text>
        <Text>{item.text}</Text>
      </View>

    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView centerContent={true}>
          {loading&&<Loader />}
          <Image source={{uri:`data:image/jpeg;base64,${WendysImage}`}} style={styles.MainImage}/>
          <View style={styles.InfoContainer}>
              <Text style={styles.Name}>{restaurant.name}</Text>
          </View>
          <View>
            <Pressable onPress={openMaps} style={styles.mapButton}><Text style={styles.Location}>Abrir ubicacion en el mapa</Text></Pressable>
            {/*Temporal despues reemplazar por un mapa de verdad*/}
            {/* <Image source={img} style={styles.Image} /> */}
          </View>
          <View style={styles.imageCarrousel}>
            <ImageCarrousel data={
              [
                {
                  id:'1',
                  image:wendys
                },
                {
                  id:'2',
                  image:wendys
                },
                {
                  id:'3',
                  image:wendys
                },
                {
                  id:'4',
                  image:wendys
                },
                {
                  id:'5',
                  image:wendys
                }
              ]
            } />
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
  },
  imageCarrousel:{
    height:150,
    marginVertical:8
  }
});
