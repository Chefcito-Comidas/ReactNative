import { Button, StyleSheet, Text, View, Image, ScrollView, SafeAreaView, Pressable, Platform, Linking } from 'react-native';
import { GetUser } from "../../hooks/getUser.hook";
import { Restaurant as RestaurantData } from "../../models/Restauran.model";
import ImageCarrousel from '../../components/ImageCarrousel/ImageCarrousel';
import { COLORS } from '../../utils/constants';
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
        <View style={styles.imageCarrousel}>
          {restaurant.pictures && restaurant.pictures.length > 0 && (
            <ImageCarrousel data={restaurant.pictures.map((item, index) => ({
              image: item,
              id: index
            }))} />
          )}
        </View>

        <View style={styles.logoContainer}>
          <Image source={{ uri: restaurant.logo }} style={styles.logoImage} />
          <Text style={styles.name}>{restaurant.name}</Text>
          <Pressable style={styles.menuButton}>
            <Text style={styles.menuButtonText}>Ver Menú</Text>
          </Pressable>
        </View>

        <View style={styles.reviewContainer}>
          <Text style={styles.sectionTitle}>Resumen de Reseñas</Text>
          <Text style={styles.reviewText}>4.5 de 5 - Basado en 120 reseñas</Text>
          <Pressable style={styles.reviewButton}>
            <Text style={styles.buttonText}>Ver todas</Text>
          </Pressable>
        </View>

        <View style={styles.featuresContainer}>
          <Text style={styles.sectionTitle}>Características</Text>
          <Text style={styles.featureText}>• Wifi Gratis</Text>
          <Text style={styles.featureText}>• Estacionamiento Disponible</Text>
          <Text style={styles.featureText}>• Comida Vegana</Text>
        </View>

        <View style={styles.buttonContainer}>
          <View style={styles.buttonWrapper}>
            <Pressable style={styles.mapButton} onPress={openMaps}>
              <Ionicons name="location-outline" size={24} color={COLORS.white} />
              <Text style={styles.mapButtonText}>Ver ubicación</Text>
            </Pressable>
            <View style={styles.smallBox}>
              <Text style={styles.smallBoxText}>500 metros</Text>
            </View>
          </View>

          <View style={styles.buttonWrapper}>
            <Pressable style={styles.newReservationButton} onPress={() =>
              navigation.navigate('NewReservation', {
                screen: 'NewReservationPeople',
                params: { restaurant },
              })
            }>
              <Text style={styles.buttonText}>Reservá!</Text>
            </Pressable>
            <View style={styles.smallBox}>
              <Text style={styles.smallBoxText}>Mín: 27 de Sep</Text>
            </View>
          </View>
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
  imageCarrousel: {
    height: 220,
    marginBottom: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#B0C4DE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  name: {
    fontSize: 26,
    fontWeight: '600',
    textAlign: 'center',
    color: COLORS.black,
    letterSpacing: 1,
  },
  menuButton: {
    backgroundColor: '#5F9EA0',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  menuButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  reviewContainer: {
    backgroundColor: '#f0f8ff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 10,
    textAlign: 'center',
  },
  reviewText: {
    fontSize: 16,
    color: COLORS.black,
    marginBottom: 10,
    textAlign: 'center',
  },
  reviewButton: {
    backgroundColor: '#5F9EA0',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 30,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  featuresContainer: {
    backgroundColor: '#f0f8ff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  featureText: {
    fontSize: 16,
    color: COLORS.black,
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  buttonWrapper: {
    flex: 1,
    position: 'relative',
    marginRight: 10,
  },
  mapButton: {
    flexDirection: 'row',
    backgroundColor: '#5F9EA0',
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  mapButtonText: {
    color: COLORS.white,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  newReservationButton: {
    flexDirection: 'row',
    backgroundColor: '#5F9EA0',
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  smallBox: {
    position: 'absolute',
    backgroundColor: '#B0C4DE',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    top: '100%',  // Se muestra justo debajo del botón
    left: '25%',  // Ajusta esta posición según el diseño que prefieras
    marginTop: -10, // Para pisar el botón un poco
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  smallBoxText: {
    color: COLORS.black,
    fontSize: 12,
  },
});

