import { Restaurant } from "../../../models/Restauran.model";
import { useState } from "react";
import { StyleSheet, View,Pressable, Text } from 'react-native';
import { COLORS } from "../../../utils/constants";
import moment from 'moment';
import CalendarPicker from "react-native-calendar-picker";
type routeParam = {
    restaurant: Restaurant;
    people: string;
};

export default function ReservationDate({ route, navigation }) {
    const [date, setDate] = useState('');
    const { restaurant, people }: routeParam = route.params;

    const cancel = () => {
        navigation.goBack();
    };

    const onAccept = () => {
        navigation.navigate('NewReservationTime', {
            people: people,
            restaurant,
            date
        });
    };

    const IsValid = () => {
        return date !== '';
    };

    const onChange = (data) => {
        setDate(data);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>¿Qué día vienen a {restaurant?.name}?</Text>
            <View>
                <CalendarPicker
                    onDateChange={onChange}
                    minDate={moment().add(restaurant.reservationLeadTime, 'days').toDate()}
                    maxDate={moment().add(restaurant.reservationLeadTime, 'days').add(1, 'month').toDate()}
                    months={[
                        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
                    ]}
                    previousTitle="Anterior"
                    nextTitle="Próximo"
                    previousTitleStyle={{ color: '#37474F' }}
                    nextTitleStyle={{ color: '#37474F' }}
                    textStyle={{ color: '#37474F' }}
                />
            </View>
            <View style={styles.buttonContainer}>
                <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => cancel()}>
                    <Text style={styles.cancelButtonText}>Atrás</Text>
                </Pressable>
                <Pressable
                    disabled={!IsValid()}
                    style={[styles.button, !IsValid() ? styles.buttonAcceptDisabled : styles.buttonAccept]}
                    onPress={() => onAccept()}>
                    <Text style={styles.textStyle}>Siguiente</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        padding: 16,
        justifyContent: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: '600',
        color: COLORS.pasteltitle,
        textAlign: 'center',
        marginBottom: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 20,
        marginTop: 'auto',
    },
    button: {
            borderRadius: 25,
            padding: 14,
            elevation: 3,
            width: 120,
            alignItems: 'center',
        },
        buttonClose: {
            backgroundColor: COLORS.pasteloscuro,
            borderColor: COLORS.pastelborder,
            borderWidth: 2,
        },
        buttonAccept: {
            backgroundColor: COLORS.pastelclaro,
            borderColor: COLORS.pastelborder,
            borderWidth: 2,
        },
        buttonAcceptDisabled: {
            backgroundColor: COLORS.pasteldisabled,
        },
        textStyle: {
            color: COLORS.white,
            fontWeight: 'bold',
            fontSize: 16,
        },
        cancelButtonText: {
            color: COLORS.white,
            fontWeight: 'bold',
            fontSize: 16,
        },
    });