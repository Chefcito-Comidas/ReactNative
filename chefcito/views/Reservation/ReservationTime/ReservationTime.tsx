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
                        label: moment(item).add(-3,'hour').local().format('HH:mm'),
                        value: moment(item).add(-3,'hour').local().format('HH:mm'),
                    }))}
                    placeHolder='Selecciona Horario'
                    customStyles={{
                        item: {
                            fontSize: 20,
                            fontWeight: '600',
                            color: COLORS.azul,
                        },
                        placeHolder: {
                            fontSize: 20,
                            fontWeight: '600',
                            color: COLORS.azul, // Gris claro
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
        backgroundColor: COLORS.white,
        padding: 16,
        justifyContent: 'center',
    },
    inputContainer: {
        marginTop: 100,
        marginBottom: 20,
        borderWidth: 2,
        borderColor: COLORS.white,
        borderRadius: 10,
        backgroundColor: COLORS.blancopaco,
        padding: 10,
    },
    select: {
        width: '100%',
    },
    title: {
        fontSize: 28,
        fontWeight: '600',
        color: COLORS.black,
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
