// Formik x React Native example
import React from 'react';
import { Button, TextInput, View,StyleSheet, Text, Pressable, Image } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { loginUserPassword } from '../../api/googleAuth';
import { COLORS } from '../../utils/constants';

export const LogInForm = ({ navigation }) => {
    const onLogin = async (values) => {
        const user = await loginUserPassword(values.email, values.password);
        if (user) {
            console.log('log in exitoso');
        } else {
            console.log('log in error');
        }
    }

    const schema = yup.object().shape({
        email: yup.string().required(),
        password: yup.string().required(),
    });

    const goToSignIn = () => {
        navigation.navigate('SignIn');
    }

    return (
        <View style={styles.container}>
        <Image source={require('../../assets/images/logochefcito.jpg')} style={styles.logo} />
            <Formik
                validationSchema={schema}
                initialValues={{ email: '', password: '' }}
                onSubmit={onLogin}
            >
                {({ handleChange, handleBlur, handleSubmit, values }) => (
                    <View style={styles.formContainer}>
                        <TextInput
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                            value={values.email}
                            style={styles.formField}
                            placeholder="Email"
                            placeholderTextColor="#555"
                        />
                        <TextInput
                            onChangeText={handleChange('password')}
                            onBlur={handleBlur('password')}
                            value={values.password}
                            style={styles.formField}
                            secureTextEntry
                            placeholder="Contraseña"
                            placeholderTextColor="#555"
                        />
                        <Pressable style={styles.button} onPress={() => handleSubmit()}>
                            <Text style={styles.buttonText}>Log In</Text>
                        </Pressable>
                    </View>
                )}
            </Formik>
            <Pressable onPress={goToSignIn}>
                <Text style={styles.signInText}>¿No tienes cuenta? Regístrate</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.pastellog,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    logo: {
        width: 200,
        height: 200,
        marginBottom: 30,
    },
    formContainer: {
        width: '100%',
        alignItems: 'center',
    },
    formField: {
        borderWidth: 1,
        borderColor: COLORS.pastelborder,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 15,
        paddingHorizontal: 15,
        paddingVertical: 10,
        minWidth: 250,
        color: '#333',
        fontSize: 16,
    },
    button: {
        backgroundColor: '#ffa726',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
    signInText: {
        marginTop: 20,
        color: '#333',
        fontSize: 14,
    },
});