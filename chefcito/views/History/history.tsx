import { GetReservationProps, GetReservations } from '../../api/bookings';
import { getRestaurantById } from '../../api/Restaurant.API';
import { GetUser } from '../../hooks/getUser.hook';
import { WendysImage } from '../../models/Restauran.model';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Pressable, TextInput } from 'react-native';
import { Reservation } from '../../models/Reservations.model';
import Loader from '../../components/Loader/Loader';
import Ionicons from '@expo/vector-icons/Ionicons';
import ReservationVerticalList from '../../components/ReservationVerticalList/ReservationVerticalList';
import { COLORS } from '../../utils/constants';

export default function History({ navigation }) {
  const { user, initializing } = GetUser();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // Estado para el texto de búsqueda
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]); // Estado para las reservas filtradas

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', (e) => {
      getReservation();
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filteredData = reservations.filter((reservation) =>
        reservation.restaurant?.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredReservations(filteredData);
    } else {
      setFilteredReservations(reservations);
    }
  }, [searchQuery, reservations]);

  const getReservation = async () => {
    if (initializing) {
      setTimeout(() => {
        getReservation();
      }, 100);
    } else {
      try {
        const props = new GetReservationProps();
        props.start = 0;
        props.limit = 20;
        setLoading(true);
        const reservation = await GetReservations(props, user);
        for (const item of reservation.result) {
          const rest = await getRestaurantById(user, item.venue);
          item.restaurant = rest.result[0];
        }
        setLoading(false);
        setReservations(reservation.result);
      } catch (err) {
        console.log('get reservation error', err);
        setLoading(false);
      }
    }
  };

  const goToReservationData = (reservation: Reservation) => {
    navigation.navigate('HistoryReservation', {
      reservation: reservation,
    });
  };

  useEffect(() => {
    if (!initializing) {
      getReservation();
    }
  }, [user, initializing]);

  return (
    <View style={styles.container}>
      {loading && <Loader />}
      <View style={styles.searchBar}>
        <Ionicons name={'search'} size={16} color={COLORS.gray} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar mis reservas"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
      </View>
      {filteredReservations.length > 0 && (
        <ReservationVerticalList data={filteredReservations} goToReservationData={goToReservationData} />
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
  searchBar: {
    borderColor: '#ddd',
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderRadius: 10,
    width: '100%',
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 16,
  },
  searchInput: {
    fontSize: 18,
    marginStart: 8,
    color: COLORS.gray,
    flex: 1,
  },
});
