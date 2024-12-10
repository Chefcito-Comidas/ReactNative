import { Button, StyleSheet, Text, View, Pressable, TextInput, ScrollView, RefreshControl, Modal, TouchableOpacity, Image } from 'react-native';
import RestaurantList from '../../components/RestaurantList/RestaurantList';
import { Restaurant } from "../../models/Restauran.model";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useCallback, useEffect, useState } from 'react';
import { getRestaurant, getRestaurantById,getRestaurantWithLocation,getRestaurantPromotion } from "../../api/Restaurant.API";
import { GetReservations, GetReservationProps } from "../../api/bookings";
import { GetUser } from '../../hooks/getUser.hook';
import Loader from '../../components/Loader/Loader';
import { Reservation } from '../../models/Reservations.model';
import ReservetionHorizontalList from '../../components/ReservationsHorizontalList/ReservetionHorizontalList';
import { COLORS } from '../../utils/constants';
import DropDownPicker from 'react-native-dropdown-picker';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

export default function Home({ navigation }) {

  const [refreshing, setRefreshing] = useState(false);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [promotionRestaurants, setPromotionRestaurants] = useState<Restaurant>(null);
  const [searchText, setSearchText] = useState('');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const { user, initializing } = GetUser();
  const [loading, setLoading] = useState(false);
  const [selectedCharacteristic, setSelectedCharacteristic] = useState(null);
  const [showPopup, setShowPopup] = useState(false); // Estado para controlar el modal


  const [location, setLocation] = useState<Location.LocationObject>(null);
  const [locationError, setLocationError] = useState<boolean>(null);
  const [open, setOpen] = useState(false);
  const [characteristics, setCharacteristics] = useState([
    { label: 'Todas las categorías', value: null },
    { label: 'Arepas', value: 'Arepas' },
    { label: 'Cafeteria', value: 'Cafeteria' },
    { label: 'Carnes', value: 'Carnes' },
    { label: 'Comida Armenia', value: 'Comida Armenia' },
    { label: 'Comida China', value: 'Comida China' },
    { label: 'Comida Japonesa', value: 'Comida Japonesa' },
    { label: 'Comida Mexicana', value: 'Comida Mexicana' },
    { label: 'Comida Vegana', value: 'Comida Vegana' },
    { label: 'Comida Vegetariana', value: 'Comida Vegetariana' },
    { label: 'Empanadas', value: 'Empanadas' },
    { label: 'Hamburguesas', value: 'Hamburguesas' },
    { label: 'Helados', value: 'Helados' },
    { label: 'Licuado y jugos', value: 'Licuado y jugos' },
    { label: 'Lomitos', value: 'Lomitos' },
    { label: 'Milanesas', value: 'Milanesas' },
    { label: 'Panaderia', value: 'Panaderia' },
    { label: 'Panchos', value: 'Panchos' },
    { label: 'Pasta', value: 'Pasta' },
    { label: 'Pescado y mariscos', value: 'Pescado y mariscos' },
    { label: 'Picadas', value: 'Picadas' },
    { label: 'Pizzas', value: 'Pizzas' },
    { label: 'Poke', value: 'Poke' },
    { label: 'Pollo', value: 'Pollo' },
    { label: 'Postres', value: 'Postres' },
    { label: 'Saludable', value: 'Saludable' },
    { label: 'Sushi', value: 'Sushi' },
    { label: 'Sándwiches', value: 'Sándwiches' },
    { label: 'Tartas', value: 'Tartas' },
    { label: 'Tortillas', value: 'Tortillas' },
    { label: 'Woks', value: 'Woks' },
    { label: 'Wraps', value: 'Wraps' },
  ]);

  const onRefresh = useCallback(() => {
    console.log('Home refresh')
    setRefreshing(true);
    getRestaurantData();
    getReservation();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, [user]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        setLocationError(true)
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getRestaurantData();
      getReservation();
      getRestaurantPromotionData();
      
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!initializing) {
      getRestaurantData();
      getReservation();
      getRestaurantPromotionData();
    }
  }, [user, initializing,location,locationError]);

  useEffect(() => {
    filterRestaurants(searchText, selectedCharacteristic);
  }, [searchText, restaurants, selectedCharacteristic]);


  const getRestauranInfo = async () =>{
    try {
      setLoading(true);
      const restaurantList = await getRestaurant(user);
      console.log(restaurantList);
      setLoading(false);
      setRestaurants(restaurantList.result);
      setFilteredRestaurants(restaurantList.result);
    } catch {
      setLoading(false);
    }
  }

  const getRestaurantWithLocationData = async () =>{
    try {
      setLoading(true);
      const restaurantList = await getRestaurantWithLocation(user,location.coords.latitude,location.coords.longitude);
      console.log(restaurantList);
      setLoading(false);
      const data:Restaurant[] = [] 
      for(const restaurant of restaurantList.result) {
        data.push({
          ...restaurant.venue,
          distance:restaurant.distance
        })
      }
      setRestaurants(data);
      setFilteredRestaurants(data);
    } catch {
      setLoading(false);
    }
  }

  const getRestaurantData = async () => {
    if(user) {
      if(location) {
        getRestaurantWithLocationData()
      }
      if(!location&&locationError) {
        getRestauranInfo()
      }
    }
  };

  const getRestaurantPromotionData = async () => {
    if (initializing) {
      setTimeout(() => {
        getRestaurantPromotionData();
      }, 100);
    } else {
      try {
        const promotionRestaurant = await getRestaurantPromotion(user);
        console.log(promotionRestaurant);
        let index = Math.floor(Math.random() * promotionRestaurant.result.length);
        setPromotionRestaurants(promotionRestaurant.result[index]);
        if (promotionRestaurant.result.length > 0){
          setShowPopup(true);
        }
      } catch {
        console.log("Error al cargar la promoción");
      }
    }
  };

  const getReservation = async () => {
    if (initializing) {
      setTimeout(() => {
        getRestaurantData();
      }, 100);
    } else {
      try {
        const props = new GetReservationProps();
        props.start = 0;
        props.limit = 20;
        props.status = "Accepted";
        const reservation = await GetReservations(props, user);
        for (const item of reservation.result) {
          const rest = await getRestaurantById(user, item.venue);
          item.restaurant = rest.result[0];
        }
        setReservations(reservation.result);
      } catch (err) {
        console.log("get reservation error", err);
      }
    }
  };

  const filterRestaurants = (text: string, characteristic: string | null) => {
    let filtered = restaurants;

    if (text) {
      filtered = filtered.filter(restaurant =>
        restaurant.name.toLowerCase().includes(text.toLowerCase())
      );
    }

    if (characteristic) {
      filtered = filtered.filter(restaurant =>
        restaurant.characteristics.includes(characteristic)
      );
    }

    setFilteredRestaurants(filtered);
  };

  const goToReservationData = (reservation: Reservation) => {
    navigation.navigate('HomeReservation', {
      reservation: reservation
    });
  };

  const goToRestaurantPage = (item:Restaurant) => {
    navigation.navigate('Restaurante', {
      restaurant:item
    });
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        >
          <View style={styles.container}>
            {loading && <Loader />}
            <View style={styles.searchAndFilterContainer}>
              <TextInput
                style={styles.searchBar}
                placeholder="A dónde comes?"
                value={searchText}
                onChangeText={setSearchText}
              />
              <DropDownPicker
                open={open}
                value={selectedCharacteristic}
                items={characteristics}
                setOpen={setOpen}
                setValue={setSelectedCharacteristic}
                setItems={setCharacteristics}
                placeholder="Filtrar por tipo"
                style={styles.dropdown}
                containerStyle={{ width: 150 }}
              />
            </View>
            {filteredRestaurants.length > 0 ? (
              <RestaurantList data={filteredRestaurants} navigation={navigation}/>
            ) : (
              <Text style={styles.noResultsText}>No se encontraron resultados</Text>
            )}
            {reservations.length > 0 && (
              <View>
                <Text style={styles.reservationTitle}>Reservas</Text>
                <ReservetionHorizontalList data={reservations} goToReservationData={goToReservationData} />
              </View>
            )}
          </View>
        </ScrollView>
        <Modal
          visible={showPopup}
          transparent
          animationType="slide"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TouchableOpacity onPress={() => setShowPopup(false)} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Te recomendamos</Text>

              {restaurants.length > 0 && (
                <View style={styles.restaurantContainer}>
                  {/* Logo del restaurante */}
                  <Image
                    source={{ uri: promotionRestaurants?.logo }}
                    style={styles.restaurantLogo}
                  />
                  
                  {/* Contenedor del nombre y botón "Ir" */}
                  <View style={styles.nameAndButtonContainer}>
                    <Text style={styles.restaurantNameProm}>{promotionRestaurants?.name}</Text>
                    <Pressable style={styles.menuButton} onPress={() => goToRestaurantPage(promotionRestaurants)}>
                      <Text style={styles.menuButtonText}>Ir</Text>
                    </Pressable>
                  </View>

                  {/* Galería de fotos */}
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageGallery}>
                    {promotionRestaurants.pictures.map((photoUrl, index) => (
                      <Image key={index} source={{ uri: photoUrl }} style={styles.restaurantImage} />
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
          </View>
        </Modal>



      </SafeAreaView>
    </SafeAreaProvider>
    
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flexGrow:1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16,
  },
  searchAndFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  reservationTitle: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  searchBar: {
    borderColor: '#ddd',
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderRadius: 10,
    width: '60%', 
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 18,
    color: COLORS.gray,
  },
  dropdown: {
    backgroundColor: '#f0f0f0',
    borderColor: '#ddd',
    borderRadius: 10,
  },
  noResultsText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.gray,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '70%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
  },
  modalTitle: {
    fontFamily: 'Montserrat 600',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  restaurantContainer: {
    alignItems: 'center',
    width: '100%',
  },
  restaurantLogo: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  restaurantNameProm: {
    fontFamily: 'Montserrat 600',
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 15,
    color: '#555',
    textAlign: 'center',
  },
  imageGallery: {
    flexDirection: 'row',
    marginTop: 10,
  },
  restaurantImage: {
    width: 180,
    height: 120,
    marginRight: 8,
    borderRadius: 15,
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
  nameAndButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '50%',
    marginBottom: 10,
  },
});
