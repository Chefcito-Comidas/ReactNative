// Formik x React Native example
import React from 'react';
import { Button, TextInput, View, StyleSheet,Text,Pressable,Image } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { createUserPassword } from '../../api/googleAuth';
import { CreateUser } from '../../api/authRestApi';
import { COLORS } from '../../utils/constants';

export const SignInForm = ({ navigation }) => {

    const signIn = async (values:any) => {
        const user = await createUserPassword(values.email, values.password);
        if(user) {
            const token = await user.getIdToken();
            const newUser = await CreateUser(token);
            console.log('sign in exitoso', newUser);
        } else {
            console.log('sign in error');
        }
    };

    const schema = yup.object().shape({
        email: yup.string().required(),
        password: yup.string().required(),
    });

    const goToLogIn = () => {
        navigation.navigate('LogIn');
    };

    return (
        <View style={styles.container}>
            <Image source={require('../../assets/images/logochefcito.jpg')} style={styles.logo} />
            <Formik
                validationSchema={schema}
                initialValues={{
                    email: '',
                    password: ''
                }}
                onSubmit={signIn}
            >
                {({ handleChange, handleBlur, handleSubmit, values }) => (
                    <View style={styles.formContainer}>
                        <TextInput
                            placeholder="Email"
                            placeholderTextColor="#8f4f0a"
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                            value={values.email}
                            style={styles.formField}
                        />
                        <TextInput
                            placeholder="Contraseña"
                            placeholderTextColor="#8f4f0a"
                            onChangeText={handleChange('password')}
                            onBlur={handleBlur('password')}
                            value={values.password}
                            style={styles.formField}
                            secureTextEntry
                        />
                        <Pressable onPress={handleSubmit} style={styles.button}>
                            <Text style={styles.buttonText}>Registrate!</Text>
                        </Pressable>
                    </View>
                )}
            </Formik>
            <Pressable onPress={goToLogIn}>
                <Text style={styles.linkText}>Ya tiene usuario, ingrese aquí</Text>
            </Pressable>
        </View>
    );
};

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
    linkText: {
        marginTop: 20,
        color: '#333',
        fontSize: 14,
    },
});