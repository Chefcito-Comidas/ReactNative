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
                placeholderTextColor="#cdab72"
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
        backgroundColor: COLORS.white,
        padding: 16,
        justifyContent: 'center',
    },
    input: {
        height: 50,
        marginVertical: 20,
        borderWidth: 1,
        padding: 12,
        borderRadius: 10,
        borderColor: COLORS.white,
        textAlign: 'center',
        color: '#263238',
        fontSize: 18,
        fontWeight: '500',
        backgroundColor: COLORS.pastelblanco,
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