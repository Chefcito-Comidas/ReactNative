import { Restaurant } from "../../../models/Restauran.model";
import { useState } from "react";
import { StyleSheet, View,Pressable, Text } from 'react-native';
import { COLORS } from "../../../utils/constants";
import { Select } from "../../../components/Select/Select";
import moment from "moment";
type routeParam = {
    restaurant: Restaurant;
    people: string;
    date: string;
    id?: string;
    home?: boolean;
};

export default function ReservationTime({ route, navigation }) {

    const [time, setTime] = useState('');
    const { restaurant, people, date, id, home }: routeParam = route.params;

    const cancel = () => {
        navigation.goBack();
    };

    const onAccept = () => {
        if (route.name === "NewReservationTime") {
            navigation.navigate('NewReservationConfirmation', {
                people: people,
                restaurant,
                date,
                time,
            });
        } else {
            navigation.navigate('EditReservationConfirmation', {
                people: people,
                restaurant,
                time,
                date,
                id,
                home,
            });
        }
    };

    const IsValid = () => {
        return time !== '';
    };

    const onChange = (data) => {
        setTime(data);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>¿A qué hora llegan a {restaurant?.name}?</Text>
            <View style={styles.inputContainer}>
                <Select
                    onValueChange={onChange}
                    items={restaurant.slots.map((item) => ({
                        label: moment(item).format('HH:mm'),
                        value: moment(item).format('HH:mm'),
                    }))}
                    placeHolder='Slecciona Horario'
                    customStyles={{
                        item: {
                            fontSize: 20,
                            fontWeight: '600',
                            color: '#1E88E5', // Azul oscuro
                        },
                        placeHolder: {
                            fontSize: 20,
                            fontWeight: '600',
                            color: '#B0BEC5', // Gris claro
                            textAlign: 'center',
                        },
                    }}
                    style={styles.select}
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
        backgroundColor: '#ECEFF1', // Gris claro
        padding: 16,
        justifyContent: 'center',
    },
    inputContainer: {
        marginTop: 100,
        marginBottom: 20,
        borderWidth: 2,
        borderColor: '#B0BEC5', // Gris claro para el borde del combo box
        borderRadius: 10,
        backgroundColor: '#FFFFFF', // Fondo blanco para el combo box
        padding: 10,
    },
    select: {
        width: '100%',
    },
    title: {
        fontSize: 28,
        fontWeight: '600',
        color: '#37474F', // Gris oscuro
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
        backgroundColor: '#CFD8DC', // Gris claro
        borderColor: '#37474F', // Gris oscuro
        borderWidth: 2,
    },
    buttonAccept: {
        backgroundColor: '#37474F',
        borderColor: '#CFD8DC',
        borderWidth: 2,
    },
    buttonAcceptDisabled: {
        backgroundColor: '#B0BEC5', // Gris
    },
    textStyle: {
        color: '#FFFFFF', // Blanco
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 16,
    },
    cancelButtonText: {
        color: '#37474F', // Gris oscuro
        fontWeight: 'bold',
        fontSize: 16,
    },
});
