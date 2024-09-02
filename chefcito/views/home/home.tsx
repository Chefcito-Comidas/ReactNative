import { Button, StyleSheet, Text, View, Pressable, TextInput } from 'react-native';
import RestaurantList from '../../components/RestaurantList/RestaurantList';
import { Restaurant, WendysImage } from "../../models/Restauran.model";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState } from 'react';
import { getRestaurant, getRestaurantById } from "../../api/Restaurant.API";
import { GetReservations, GetReservationProps } from "../../api/bookings";
import { GetUser } from '../../hooks/getUser.hook';
import Loader from '../../components/Loader/Loader';
import { Reservation } from '../../models/Reservations.model';
import ReservetionHorizontalList from '../../components/ReservationsHorizontalList/ReservetionHorizontalList';
import { COLORS } from '../../utils/constants';

export default function Home({ navigation }) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [searchText, setSearchText] = useState('');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const { user, initializing } = GetUser();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getRestaurantData();
      getReservation();
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!initializing) {
      getRestaurantData();
      getReservation();
    }
  }, [user, initializing]);

  useEffect(() => {
    filterRestaurants(searchText);
  }, [searchText, restaurants]);

  const getRestaurantData = async () => {
    if (initializing) {
      setTimeout(() => {
        getRestaurantData();
      }, 100);
    } else {
      try {
        setLoading(true);
        const restaurantList = await getRestaurant(user);
        setLoading(false);
        setRestaurants(restaurantList.result);
        setFilteredRestaurants(restaurantList.result);
      } catch {
        setLoading(false);
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

  const filterRestaurants = (text: string) => {
    const filtered = restaurants.filter(restaurant =>
      restaurant.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredRestaurants(filtered);
  };

  const goToReservationData = (reservation: Reservation) => {
    navigation.navigate('HomeReservation', {
      reservation: reservation
    });
  };

  return (
    <View style={styles.container}>
      {loading && <Loader />}
      <TextInput
        style={styles.searchBar}
        placeholder="A dónde querés comer?"
        value={searchText}
        onChangeText={setSearchText}
      />
      {filteredRestaurants.length > 0 && (
        <RestaurantList data={filteredRestaurants} navigation={navigation} />
      )}
      {reservations.length > 0 && (
        <View>
          <Text style={styles.reservationTitle}>Reservas</Text>
          <ReservetionHorizontalList data={reservations} goToReservationData={goToReservationData} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16,
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
    width: '100%',
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 18,
    marginBottom: 16,
  },
});
