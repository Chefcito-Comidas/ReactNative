import { useEffect, useState } from "react"
import { StyleSheet, View,Pressable, Text,TextInput } from 'react-native';
import { COLORS } from "../../../utils/constants";
import { Restaurant } from "../../../models/Restauran.model";

type routeParam = {
    restaurant: Restaurant;
    date?: string;
    id?: string;
    home?: boolean;
};

export default function ReservationPeople({ route, navigation }) {
    const [people, setPeople] = useState('1');
    const { restaurant, date, id, home }: routeParam = route?.params;

    useEffect(() => {
        console.log('route', route?.params?.restaurant);
    }, []);

    const cancel = () => {
        navigation.goBack();
    };

    const onAccept = () => {
        if (route.name === "NewReservationPeople") {
            navigation.navigate('NewReservationDate', {
                people: people,
                restaurant
            });
        } else {
            navigation.navigate('EditReservationTime', {
                people: people,
                restaurant,
                date,
                id,
                home,
            });
        }
    };

    const IsValid = () => {
        return people !== '' && parseInt(people);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>¿Cuántas personas vienen a {restaurant?.name}?</Text>
            <TextInput
                style={styles.input}
                onChangeText={(value) => setPeople(value)}
                value={people}
                placeholder="Cantidad de personas"
                placeholderTextColor="#B0BEC5"
                keyboardType="numeric"
            />
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
        backgroundColor: '#ECEFF1',
        padding: 16,
        justifyContent: 'center',
    },
    input: {
        height: 50,
        marginVertical: 20,
        borderWidth: 1,
        padding: 12,
        borderRadius: 10,
        borderColor: '#CFD8DC',
        textAlign: 'center',
        color: '#263238',
        fontSize: 18,
        fontWeight: '500',
        backgroundColor: '#FFFFFF',
    },
    title: {
        fontSize: 28,
        fontWeight: '600',
        color: '#37474F',
        textAlign: 'center',
        marginBottom: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 20,
    },
    button: {
        borderRadius: 25,
        padding: 14,
        elevation: 3,
        width: 120,
        alignItems: 'center',
    },
    buttonClose: {
        backgroundColor: '#CFD8DC',
        borderColor: '#37474F',
        borderWidth: 2,
    },
    buttonAccept: {
        backgroundColor: '#37474F',
        borderColor: '#CFD8DC',
        borderWidth: 2,
    },
    buttonAcceptDisabled: {
        backgroundColor: '#B0BEC5',
    },
    textStyle: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    cancelButtonText: {
        color: '#37474F',
        fontWeight: 'bold',
        fontSize: 16,
    },
});