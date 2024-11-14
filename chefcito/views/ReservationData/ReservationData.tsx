import { SafeAreaView, View, Image, Pressable, StyleSheet, Text, ScrollView, Platform, Linking, Modal, TextInput } from 'react-native';
import { useEffect, useState } from 'react';
import { GetUser } from '../../hooks/getUser.hook';
import Loader from '../../components/Loader/Loader';
import { Reservation } from '../../models/Reservations.model';
import { CancelBooking, ConfirmBooking } from '../../api/bookings';
import { ConfirmationModal } from '../../components/ConfirmationModal/ComfirmationModal';
import { COLORS } from '../../utils/constants';
import { Ionicons } from '@expo/vector-icons';
import BarCodeScannerComponent from '../../components/BarCodeScanner/BarCodeScanner';
import moment from 'moment';
import { PostOpinion } from '../../api/opinion.API';
import * as Font from 'expo-font';

type routeParam = {
    reservation: Reservation;
};

export default function ReservationData({ route, navigation }) {
    const [show, setShow] = useState(false);
    const { user } = GetUser();
    const { reservation }: routeParam = route.params;
    const [loading, setLoading] = useState(false);
    const [showQrScanner, setShowQrScanner] = useState(false);
    const [opinionModalVisible, setOpinionModalVisible] = useState(false);
    const [opinion, setOpinion] = useState('');
    const [fontsLoaded, setFontsLoaded] = useState(false); // Estado para verificar si la fuente está cargada

    useEffect(() => {
        const loadFonts = async () => {
        await Font.loadAsync({
            'Montserrat': require('../../assets/fonts/Montserrat-VariableFont_wght.ttf'),
        });
        setFontsLoaded(true);
        };

        loadFonts();
    }, []);

    const openMaps = () => {
        //const fullAddress = reservation.restaurant.location.split('@')[1] || reservation.restaurant.location;
        const url = Platform.select({
            ios: `maps:0,0?q=${reservation.restaurant.location}`,
            android: `geo:0,0?q=${reservation.restaurant.location}`,
        });
        Linking.openURL(url);
    };

    const onAccept = async () => {
        setShow(false);
        try {
            setLoading(true);
            await CancelBooking(reservation, user);
        } catch (err) {
            console.log('Error al cancelar');
        } finally {
            alert('Reserva cancelada');
            setLoading(false);
        }
    };

    const onCancel = () => setShow(false);

    const confirmReservation = async (id: string) => {
        setTimeout(()=>{
            setShowQrScanner(false);
        },500)
        const timeDiff = moment().diff(moment(reservation.time), 'hours');
        if (id === reservation.venue && timeDiff < 12) {
            try{ 
                setLoading(true)
                const data = await ConfirmBooking(reservation, user);
                console.log('reserva creada',data)
                setLoading(false)
                alert("Reserva confirmada con Exito")
            } catch (err) {
                setLoading(false)
                alert("Error al confirmar reserva")
            }
        }
    };

    const openOpinionModal = () => {
        setOpinionModalVisible(true);
    };

    const closeOpinionModal = () => {
        setOpinionModalVisible(false);
    };

    const submitOpinion = async() => {
        console.log('Opinión enviada:', opinion);
        const OpinionUser = {
            reservation:reservation.id,
            opinion:opinion,
            venue:reservation.venue,
            date:moment().toISOString(),
        }
        console.log(OpinionUser);
        try {
            setLoading(true);
            const result = await PostOpinion(OpinionUser, user);
            alert("Opinion creada");
        } catch (err) {
            console.log('Error al Enviar opinion', err);
            alert("Error al crear Opinion");
        } finally {
            setOpinionModalVisible(false);
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {loading && <Loader />}
                <Image source={{ uri: reservation.restaurant?.logo }} style={styles.mainImage} />
                <View style={styles.infoContainer}>
                    <View style={styles.nameContainer}>
                        <Text style={styles.name}>{reservation.restaurant.name}</Text>
                        <Pressable style={styles.mapButton} onPress={openMaps}>
                            <Ionicons name="location-outline" size={24} color={COLORS.white} />
                            <Text style={styles.mapButtonText}>Ver ubicación</Text>
                        </Pressable>
                    </View>
                    <View style={styles.detailsContainer}>
                        <Text style={styles.infoText}>Lugar: {reservation.restaurant.name}</Text>
                        <Text style={styles.infoText}>Personas: {reservation.people}</Text>
                        <Text style={styles.infoText}>Horario: {reservation.time}</Text>
                    </View>
                </View>

                {(reservation.status.status === 'Uncomfirmed' || reservation.status.status === 'Accepted') && (
                    <View style={styles.buttonRow}>
                        <Pressable style={styles.cancelButton} onPress={() => setShow(true)}>
                            <Text style={styles.buttonText}>Cancelar</Text>
                        </Pressable>
                        <Pressable
                            style={styles.editButton}
                            onPress={() =>
                                navigation.navigate('EditReservation', {
                                    screen: 'EditReservationPeople',
                                    params: {
                                        restaurant: reservation.restaurant,
                                        id: reservation.id,
                                        date: reservation.time,
                                        home: route.name === 'HomeReservation',
                                    },
                                })
                            }
                        >
                            <Text style={styles.buttonText}>Editar</Text>
                        </Pressable>
                    </View>
                )}

                {(reservation.status.status === 'Accepted') && (
                    <Pressable style={styles.scanButton} onPress={() => setShowQrScanner(true)}>
                        <Text style={styles.buttonText}>Escanear</Text>
                        <Ionicons name="qr-code-outline" size={16} color={COLORS.white} style={styles.iconStyle} />
                    </Pressable>
                )}

                {reservation.status.status === 'Assisted' && (
                    <Pressable style={styles.opinionButton} onPress={openOpinionModal}>
                        <Text style={styles.buttonText}>Deja tu opinión</Text>
                        <Ionicons name="create-outline" size={16} color={COLORS.white} style={styles.iconStyle} />
                    </Pressable>
                )}

                <BarCodeScannerComponent cancel={() => { setShowQrScanner(false); }} show={showQrScanner} accept={confirmReservation} />
                <ConfirmationModal
                    show={show}
                    title="Cancelar Reserva"
                    subtitle="Va a cancelar la reserva, ¿Está seguro?"
                    onAccept={onAccept}
                    onCancel={onCancel}
                />

                <Modal visible={opinionModalVisible} transparent={true} animationType="slide">
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Pressable style={styles.closeButton} onPress={closeOpinionModal}>
                                <Ionicons name="close-outline" size={30} color={COLORS.black} />
                            </Pressable>
                            <Text style={styles.modalTitle}>Escribe tu opinión</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Escribe tu opinión aquí"
                                value={opinion}
                                onChangeText={setOpinion}
                                multiline
                            />
                            <Pressable style={styles.submitButton} onPress={submitOpinion}>
                                <Text style={styles.buttonText}>Enviar</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        paddingHorizontal: 16,
        paddingVertical: 24,
    },
    scrollContent: {
        alignItems: 'center',
    },
    mainImage: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        marginBottom: 20,
    },
    infoContainer: {
        width: '100%',
        maxWidth: 400,
        alignItems: 'center',
        marginBottom: 20,
    },
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 12,
    },
    name: {
        fontFamily: 'Montserrat 600',
        fontSize: 28,
        fontWeight: '600',
        color: COLORS.black,
        flex: 1,
        marginRight: 10,
    },
    mapButton: {
        flexDirection: 'row',
        backgroundColor: '#5F9EA0',
        paddingVertical: 10,
        paddingHorizontal: 15,
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
        marginLeft: 5,
        fontSize: 16,
    },
    detailsContainer: {
        backgroundColor: COLORS.blancopaco,
        borderRadius: 12,
        padding: 16,
        width: '100%',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 5 },
        shadowRadius: 10,
        elevation: 3,
        alignItems: 'center',
    },
    infoText: {
        fontSize: 16,
        color: COLORS.gray,
        marginBottom: 5,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 20,
    },
    cancelButton: {
        backgroundColor: COLORS.error,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        width: '48%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    editButton: {
        backgroundColor: COLORS.dataExtra,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        width: '48%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scanButton: {
        backgroundColor: COLORS.blue,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    opinionButton: {
        backgroundColor: COLORS.blue,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 16,
    },
    iconStyle: {
        marginLeft: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: COLORS.white,
        borderRadius: 8,
        padding: 20,
        width: '90%',
        maxWidth: 400,
    },
    closeButton: {
        alignSelf: 'flex-end',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    textInput: {
        borderWidth: 1,
        borderColor: COLORS.gray,
        borderRadius: 8,
        padding: 10,
        height: 100,
        textAlignVertical: 'top',
        marginBottom: 10,
    },
    submitButton: {
        backgroundColor: COLORS.blue,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
});
