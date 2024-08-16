import { Button, StyleSheet, Text, View,Image,ScrollView,SafeAreaView, Pressable, Platform, Linking  } from 'react-native';
import {GetUser} from "../../hooks/getUser.hook";
import {Restaurant as RestaurantData, WendysImage} from "../../models/Restauran.model";
import ImageCarrousel from '../../components/ImageCarrousel/ImageCarrousel';
import { COLORS } from '../../utils/constants';
const wendys_1 = require('../../assets/images/wendys.jpg')
const wendys_2 = require('../../assets/images/wendys_menu_1.jpg')
const wendys_3 = require('../../assets/images/wendys_menu_2.jpg')
const wendys_4= require('../../assets/images/wendys_menu_3.jpg')

type routeParam = {
  restaurant:RestaurantData
}
export default function Restaurant({route, navigation}) {
 
  const {
    user,
  } = GetUser()
  const {restaurant}:routeParam = route.params;

  const openMaps = () => {
    const fullAddress = restaurant.location.split("@").length>0?restaurant.location.split("@")[1]:restaurant.location
    const url = Platform.select({
      ios: `maps:0,0?q=${fullAddress}`,
      android: `geo:0,0?q=${fullAddress}`,
    })
    
    Linking.openURL(url)
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView centerContent={true}>
          <Image source={{uri:restaurant.logo}} style={styles.MainImage}/>
          <View style={styles.InfoContainer}>
              <Text style={styles.Name}>{restaurant.name}</Text>
          </View>
          <View>
            <Pressable onPress={openMaps} style={styles.mapButton}><Text style={styles.Location}>Abrir ubicacion en el mapa</Text></Pressable>
          </View>
          <View style={styles.imageCarrousel}>
            {restaurant.pictures&&restaurant.pictures.length>0&&<ImageCarrousel data={
              restaurant.pictures.map((item,index)=>{
                return {
                  image:item,
                  id:index
                }
              })
            } />}
          </View>
          <View style={styles.ButtonContainer}>
            <Pressable style={styles.newReservationButton} onPress={()=>
              navigation.navigate('NewReservation',{
                screen: 'NewReservationPeople',
                params: {
                  restaurant
                },
              })
            }>
              <Text style={styles.ButtonText}>Hacer una Reserva</Text>
            </Pressable>
          </View>
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
    textAlign:'center',
    color:COLORS.blue
  },
  Location:{
    textAlign:'center',
    color:COLORS.white,
  },
  InfoContainer:{
  },
  Image:{
    height:300,
  },
  ButtonContainer:{
    marginTop:80
  },
  mapButton:{
    borderColor:COLORS.silver,
    color:COLORS.white,
    backgroundColor:COLORS.blue,
    borderWidth:2,
    borderRadius:8,
    paddingStart:8,
    textAlign:'center'
  },
  imageCarrousel:{
    height:150,
    marginVertical:8
  },
  newReservationButton:{
    backgroundColor:COLORS.blue,
    width:200,
    alignSelf:'center',
    padding:4,
    borderRadius:15,
    borderColor:COLORS.silver,
    borderWidth:2,
  },
  ButtonText:{
    textAlign:'center',
    color:COLORS.white,
    fontSize:18
  }
});
