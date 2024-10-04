import { StyleSheet, View, TextInput } from 'react-native';
import { Restaurant } from "../../models/Restauran.model";
import { useEffect, useState } from 'react';
import { getRestaurant } from "../../api/Restaurant.API";
import { GetUser } from '../../hooks/getUser.hook';
import Loader from '../../components/Loader/Loader';
import { COLORS } from '../../utils/constants';
import DropDownPicker from 'react-native-dropdown-picker';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

export default function Map({ navigation }) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [searchText, setSearchText] = useState('');
  const { user, initializing } = GetUser();
  const [loading, setLoading] = useState(false);
  const [selectedCharacteristic, setSelectedCharacteristic] = useState(null);

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

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getRestaurantData();
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!initializing) {
      getRestaurantData();
    }
  }, [user, initializing]);

  useEffect(() => {
    filterRestaurants(searchText, selectedCharacteristic);
  }, [searchText, restaurants, selectedCharacteristic]);

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

  return (
    <View style={styles.container}>
      {loading && <Loader />}
      <View style={styles.searchAndFilterContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="A dónde querés comer?"
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
      <View>
        <MapView style={styles.map} 
        provider={PROVIDER_GOOGLE}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    width: '60%', // Ajusta el ancho para que el dropdown pueda aparecer al lado
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
  map: {
    width: '100%',
    height: '100%',
  },
});
