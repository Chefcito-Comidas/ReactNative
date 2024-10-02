import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View, Image, ScrollView, SafeAreaView, Pressable, Platform, Linking, Modal } from 'react-native';
import * as Font from 'expo-font';
import { GetUser } from "../../hooks/getUser.hook";
import { Restaurant as RestaurantData } from "../../models/Restauran.model";
import ImageCarrousel from '../../components/ImageCarrousel/ImageCarrousel';
import { COLORS } from '../../utils/constants';
import { Ionicons } from '@expo/vector-icons';
import { Summary } from 'models/opinion.model';
import { GetSummary, GetSummaries } from '../../api/opinion.API'; // Importar GetSummaries para obtener todas las opiniones
import moment from 'moment';

type routeParam = {
  restaurant: RestaurantData
}

export default function Restaurant({ route, navigation }) {
  const { user } = GetUser();
  const { restaurant }: routeParam = route.params;

  const [summaryText, setSummaryText] = useState<string | null>(null);
  const [menuModalVisible, setMenuModalVisible] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false); // Estado para verificar si la fuente está cargada

  // Estado para manejar la visibilidad del popup con las opiniones
  const [reviewsModalVisible, setReviewsModalVisible] = useState(false);
  const [reviews, setReviews] = useState<Summary[]>([]); // Estado para almacenar las opiniones

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        'Montserrat': require('../../assets/fonts/Montserrat-VariableFont_wght.ttf'),
      });
      setFontsLoaded(true);
    };

    loadFonts();
  }, []);

  useEffect(() => {
    const fetchSummary = async () => {
      if (user) {
        try {
          const response = await GetSummary(user, restaurant.id);
          setSummaryText(response.text); // Actualiza el estado con el texto del resumen
        } catch (error) {
          console.error('Error al obtener el resumen:', error);
          setSummaryText('No hay resumen disponible.'); // Manejo de errores
        }
      }
    };

    fetchSummary();
  }, [user, restaurant.id]);

  // Función para obtener todas las opiniones del restaurante
  const fetchReviews = async () => {
    if (user) {
      try {
        const response = await GetSummaries(user, restaurant.id);
        setReviews(response); // Actualiza el estado con las opiniones recibidas
      } catch (error) {
        console.error('Error al obtener las opiniones:', error);
      }
    }
  };

  const openMaps = () => {
    const fullAddress = restaurant.location.split("@").length > 0 ? restaurant.location.split("@")[1] : restaurant.location;
    const url = Platform.select({
      ios: `maps:0,0?q=${fullAddress}`,
      android: `geo:0,0?q=${fullAddress}`,
    });

    Linking.openURL(url);
  }

 // if (!fontsLoaded) {
 //   return <Text>Cargando fuentes...</Text>;
 // }

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
          <Pressable style={styles.menuButton} onPress={() => setMenuModalVisible(true)}>
            <Text style={styles.menuButtonText}>Ver Menú</Text>
          </Pressable>
        </View>

        <View style={styles.reviewContainer}>
          <Text style={styles.sectionTitle}>Resumen de Reseñas</Text>
          <Text style={styles.reviewText}>
            {summaryText ? summaryText : 'Cargando...'} {/* Muestra el resumen o un mensaje de carga */}
          </Text>
          <Pressable style={styles.reviewButton} onPress={() => {
            setReviewsModalVisible(true);
            fetchReviews(); // Llamar a la función para obtener las opiniones al abrir el popup
          }}>
            <Text style={styles.buttonText}>Ver todas</Text>
          </Pressable>
        </View>

        <View style={styles.featuresContainer}>
          <Text style={styles.sectionTitle}>Características</Text>
            {restaurant.features.map((feature, index) => (
            <Text key={index} style={styles.featureText}>• {feature}</Text>
              ))}
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
              <Text style={styles.smallBoxText}>Min:{moment().add(restaurant.reservationLeadTime,'days').format('DD [de] MMM')}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Modal del Menú */}
      <Modal
        visible={menuModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Menú del Local</Text>
            <Image source={{ uri: restaurant.menu }} style={styles.menuImage} />
            <Pressable style={styles.closeButton} onPress={() => setMenuModalVisible(false)}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* modal de las reseñas */}
      <Modal
        visible={reviewsModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setReviewsModalVisible(false)}
      >
        <View style={styles.reviewsModalContainer}>
          <View style={styles.reviewsModalContent}>
            <Text style={styles.modalTitle}>Reseñas de {restaurant.name}</Text>
            <ScrollView style={styles.reviewsScrollView}>
              {reviews.map((review, index) => (
                <View key={index}>
                  <Text style={styles.reviewText}>{review.text}</Text>
                  {index < reviews.length - 1 && <View style={styles.reviewSeparator} />} 
                </View>
              ))}
            </ScrollView>
            <Pressable style={styles.closeButton} onPress={() => setReviewsModalVisible(false)}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

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
    fontFamily: 'Montserrat 600',
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
    fontFamily: 'Montserrat 600',
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 10,
    textAlign: 'center',
  },
  reviewText: {
    fontFamily: 'Montserrat',
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
    fontFamily: 'Montserrat',
    fontSize: 20,
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
    borderRadius: 5,
    top: -12,
    right: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  smallBoxText: {
    color: COLORS.black,
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 7,
    elevation: 6,
  },
  modalTitle: {
    fontFamily: 'Montserrat 600',
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 15,
    color: COLORS.black,
  },
  menuImage: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
    marginBottom: 15,
  },
  closeButton: {
    backgroundColor: COLORS.error,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  closeButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  reviewsModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  reviewsModalContent: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 7,
    elevation: 6,
  },
  reviewsScrollView: {
    width: '100%',
    maxHeight: 300,
    marginBottom: 15,
  },
  reviewSeparator: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginVertical: 10,
  },
});
