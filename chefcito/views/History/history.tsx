import { GetReservationProps, GetReservations } from '../../api/bookings';
import { getRestaurantById } from '../../api/Restaurant.API';
import { GetUser } from '../../hooks/getUser.hook';
import { WendysImage } from '../../models/Restauran.model';
import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Pressable, TextInput, ScrollView, RefreshControl } from 'react-native';
import { Reservation } from '../../models/Reservations.model';
import Loader from '../../components/Loader/Loader';
import Ionicons from '@expo/vector-icons/Ionicons';
import ReservationVerticalList from '../../components/ReservationVerticalList/ReservationVerticalList';
import { COLORS } from '../../utils/constants';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function History({ navigation }) {
  const { user, initializing } = GetUser();
  const init = useRef(true)
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // Estado para el texto de búsqueda
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]); // Estado para las reservas filtradas

  const [refreshing, setRefreshing] = useState(false);

const onRefresh = useCallback(async () => {
  setRefreshing(true);
  await getReservation(); // Espera a que la función termine
  setRefreshing(false);   // Luego de que los datos se cargan, detén el refresco
}, []);

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
    console.log('getReservation',init.current)
    //if (init.current) {
    //  setTimeout(() => {
    //    getReservation();
    //  }, 100);
    //} else {
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
    //}
  };

  const goToReservationData = (reservation: Reservation) => {
    navigation.navigate('HistoryReservation', {
      reservation: reservation,
    });
  };

  useEffect(() => {
    init.current = initializing
    if (!initializing) {
      getReservation();
    }
  }, [user, initializing]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
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
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
    
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flexGrow:1,
    backgroundColor: 'pink',
    alignItems: 'center',
    justifyContent: 'center',
  },
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
