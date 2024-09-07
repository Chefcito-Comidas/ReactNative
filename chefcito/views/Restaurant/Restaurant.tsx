import { Button, StyleSheet, Text, View,Image,ScrollView,SafeAreaView, Pressable, Platform, Linking  } from 'react-native';
import {GetUser} from "../../hooks/getUser.hook";
import {Restaurant as RestaurantData, WendysImage} from "../../models/Restauran.model";
import ImageCarrousel from '../../components/ImageCarrousel/ImageCarrousel';
import { COLORS } from '../../utils/constants';
const wendys_1 = require('../../assets/images/wendys.jpg')
const wendys_2 = require('../../assets/images/wendys_menu_1.jpg')
const wendys_3 = require('../../assets/images/wendys_menu_2.jpg')
const wendys_4= require('../../assets/images/wendys_menu_3.jpg')
import { Ionicons } from '@expo/vector-icons';

type routeParam = {
  restaurant: RestaurantData
}

export default function Restaurant({ route, navigation }) {

  const { user } = GetUser();
  const { restaurant }: routeParam = route.params;

  const openMaps = () => {
    const fullAddress = restaurant.location.split("@").length > 0 ? restaurant.location.split("@")[1] : restaurant.location;
    const url = Platform.select({
      ios: `maps:0,0?q=${fullAddress}`,
      android: `geo:0,0?q=${fullAddress}`,
    });

    Linking.openURL(url);
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView centerContent={true}>
        <Image source={{ uri: restaurant.logo }} style={styles.mainImage} />
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{restaurant.name}</Text>
        </View>
        <View style={styles.imageCarrousel}>
          {restaurant.pictures && restaurant.pictures.length > 0 && (
            <ImageCarrousel data={restaurant.pictures.map((item, index) => ({
              image: item,
              id: index
            }))} />
          )}
        </View>
        <View style={styles.buttonContainer}>
          <Pressable style={styles.mapButton} onPress={openMaps}>
            <Ionicons name="location-outline" size={24} color={COLORS.white} />
          </Pressable>
          <Pressable style={styles.newReservationButton} onPress={() =>
            navigation.navigate('NewReservation', {
              screen: 'NewReservationPeople',
              params: { restaurant },
            })
          }>
            <Text style={styles.buttonText}>Reserva!</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
  },
  mainImage: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    marginBottom: 20,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: COLORS.black,
  },
  infoContainer: {
    marginBottom: 16,
  },
  imageCarrousel: {
    height: 200,
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
  },
  mapButton: {
    backgroundColor: COLORS.pastelclaro,
    padding: 10,
    borderRadius: 50,
    marginRight: 16,
    borderColor: COLORS.pastelborder,
  },
  newReservationButton: {
    backgroundColor: COLORS.pastelclaro,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 50,
    borderColor: COLORS.pastelborder,
    borderWidth: 2,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});