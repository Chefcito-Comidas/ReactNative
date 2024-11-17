import React, { useEffect, useState } from 'react';
import { Button,StyleSheet, Text, View, Image, ScrollView, SafeAreaView, Pressable, Platform, Linking, Modal } from 'react-native';
import * as Font from 'expo-font';
import { GetUser } from "../../hooks/getUser.hook";
import { Restaurant as RestaurantData } from "../../models/Restauran.model";
import ImageCarrousel from '../../components/ImageCarrousel/ImageCarrousel';
import { COLORS } from '../../utils/constants';
import { Ionicons } from '@expo/vector-icons';
import { Summary } from 'models/opinion.model';
import { GetSummary, GetSummaries } from '../../api/opinion.API'; // Comentamos la importación de GetSummaries
import moment from 'moment';

type routeParam = {
  restaurant: RestaurantData
}

export default function Restaurant({ route, navigation }) {

  const { restaurant }: routeParam = route.params;
  const { user, initializing } = GetUser();
  const [summaryText, setSummaryText] = useState<string | null>(null);
  const [menuModalVisible, setMenuModalVisible] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);


  const [reviewsModalVisible, setReviewsModalVisible] = useState(false);
  const [reviews, setReviews] = useState<{ text: string }[]>([]); 

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        'Montserrat': require('../../assets/fonts/Montserrat-VariableFont_wght.ttf'),
      });
      setFontsLoaded(true);
    };

    loadFonts();
  }, []);

  const summaryReview = async () => {
    console.log("entro a la funcion")
    if(user){
      try {
        const response = await GetSummary(user,restaurant.id);
        setSummaryText(response.text);
        console.log("respuesta de summary",response)
      } catch (error) {
        console.log("Summary error",error);
        setTimeout(() => {
           summaryReview();
        }, 500);
      }
    }
  };

  const getDistance = (distance:number):string => {
    if(distance < 1000) {
      return ` A ${distance} m`
    } else {
      return ` A ${Math.floor(distance/1000)} km`
    }
  }

  useEffect(() => {
    if (!initializing) {
      console.log("useeffect de summary")
      summaryReview();
    }
  }, [user, initializing]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const fetchReviews = async () => {
    setLoadingReviews(true);
    try {
      const response = await GetSummaries(user, restaurant.id);
      const opinionsArray = response.result.map((item: any) => item.opinion);
      console.log("Array de opiniones",opinionsArray)
      setReviews(opinionsArray);
    } catch (error) {
      console.log("Summaries error", error);
    } finally {
      setLoadingReviews(false);
    }
  };

  const openMaps = () => {
    //const fullAddress = restaurant.location.split(",").length > 0 ? restaurant.location.split(",")[1] : restaurant.location;
    const url = Platform.select({
      ios: `maps:0,0?q=${restaurant.location}`,
      android: `geo:0,0?q=${restaurant.location}`,
    });

    Linking.openURL(url);
  }

  const openMenu = () => {
    Linking.openURL(restaurant.menu);
  }
  console.log("Restaurant menu:",restaurant.menu)

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
          <Image source={{ uri: restaurant?.logo }} style={styles.logoImage} />
          <Text style={styles.name}>{restaurant.name}</Text>
          <Text style={styles.smallBoxText}>{restaurant.distance?getDistance(restaurant.distance):''}</Text>
          <Text style={styles.smallBoxText}>Reserva a partir de: {moment().add(restaurant.reservationLeadTime,'days').format('DD [de] MMM')}</Text>
          <Pressable style={styles.menuButton} onPress={() => openMenu()}>
            <Text style={styles.menuButtonText}>Ver Menú</Text>
          </Pressable>
        </View>

        <View style={styles.reviewContainer}>
          <Text style={styles.sectionTitle}>Resumen de Reseñas</Text>
          <Text style={styles.reviewText}>
            {summaryText ? summaryText : 'Cargando...'}
          </Text>
          <Pressable style={styles.reviewButton} onPress={() => {
            setReviewsModalVisible(true);
            fetchReviews(); 
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
          <Pressable style={styles.actionButton} onPress={openMaps}>
            <Ionicons name="location-outline" size={24} color={COLORS.white} />
            <Text style={styles.buttonText}>Ver ubicación</Text>
          </Pressable>

          <Pressable style={styles.actionButton} onPress={() =>
              navigation.navigate('NewReservation', {
              screen: 'NewReservationPeople',
              params: { restaurant },
            })
          }>
          <Text style={styles.buttonText}>Reservá!</Text>
          </Pressable>
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
            <Pressable style={styles.closeButton} onPress={() => setMenuModalVisible(false)}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Modal de las reseñas */}
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
              {loadingReviews ? (
                  <Text>Cargando reseñas...</Text>
                ) : (
                  reviews.map((review, index) => (
                    <View key={index}>
                      <Text style={styles.reviewText}>{review}</Text>
                      {index < reviews.length - 1 && <View style={styles.reviewSeparator} />}
                    </View>
                  ))
                )}
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
    fontFamily: 'Montserrat 600',
    color: COLORS.black,
    fontWeight: '600',
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  actionButton: {
    flex: 1, // Ambos botones tienen el mismo tamaño
    flexDirection: 'row', // Para alinear el icono y el texto en línea
    backgroundColor: '#5F9EA0',
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5, // Espacio entre los botones
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    marginLeft: 2, // Espacio entre el icono y el texto
  },
});
