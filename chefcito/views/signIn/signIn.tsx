// Formik x React Native example
import React from 'react';
import { Button, TextInput, View, StyleSheet,Text,Pressable } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { createUserPassword } from '../../api/googleAuth';
import { CreateUser } from '../../api/authRestApi';

export const SignInForm = ({ navigation }) => {

    const signIn = async (values:any) => {
        const user = await createUserPassword(values.email,values.password)
        if(user) {
            const token = await user.getIdToken()
            const newUser = await CreateUser(token)
            console.log('sign in exitoso',newUser)
        } else {
            console.log('sign in error')
        }
    }

    const schema = yup.object().shape({
        email:yup.string().required(),
        password:yup.string().required(),
    });

    const goToLogIn = () => {
        navigation.navigate('LogIn')
    }
    return (
        <View style={styles.container}>
            <Formik
            validationSchema={schema}
            initialValues={{
                email:'',
                password:''
            }}
            onSubmit={signIn}
            >
                {({ handleChange, handleBlur, handleSubmit, values }) => (
                <View>
                    <TextInput
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={values.email}
                    style={styles.formField}
                    />
                    <TextInput
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                    style={styles.formField}
                    secureTextEntry
                    />
                    <Button onPress={()=>handleSubmit()} title="Sign In" />
                </View>
                )}
            </Formik>
            <Pressable onPress={goToLogIn}><Text>Ya tiene usuario ingrese aqui</Text></Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    formField:{
        borderWidth:1,
        borderRadius:10,
        marginBottom:8,
        minWidth:200
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});