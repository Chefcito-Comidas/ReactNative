import { useEffect, useState } from "react";
import { StyleSheet, View, Pressable, Text, TextInput } from 'react-native';
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
            <Text style={styles.title}>¿Cuántas personas asistirán a {restaurant?.name}?</Text>
            <TextInput
                style={styles.input}
                onChangeText={(value) => setPeople(value)}
                value={people}
                placeholder="Cantidad de personas"
                placeholderTextColor="#A9A9A9"
                keyboardType="numeric"
            />
            <View style={styles.buttonContainer}>
                <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => cancel()}>
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
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
        justifyContent: 'center',
        padding: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: COLORS.primaryText,
        textAlign: 'center',
        marginBottom: 24,
    },
    input: {
        height: 50,
        borderWidth: 1,
        padding: 12,
        borderRadius: 12,
        borderColor: COLORS.lightGrey,
        textAlign: 'center',
        fontSize: 18,
        backgroundColor: COLORS.inputBackground,
        color: COLORS.primaryText,
        marginBottom: 24,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        borderRadius: 30,
        padding: 16,
        width: '45%',
        alignItems: 'center',
        elevation: 5,
    },
    buttonClose: {
        backgroundColor: COLORS.decline,
    },
    buttonAccept: {
        backgroundColor: COLORS.accept,
    },
    buttonAcceptDisabled: {
        backgroundColor: COLORS.disabled,
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

