// Formik x React Native example
import React from 'react';
import { Button, TextInput, View,StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { loginUserPassword } from '../../../api/googleAuth';

export const LogInForm = () => {
    const onLogin = async (values:any) =>{
        const user = await loginUserPassword(values.email,values.password)
        if(user) {
            console.log('log in exitoso')
        } else {
            console.log('log in error')
        }
    }

    const schema = yup.object().shape({
        email:yup.string().required(),
        password:yup.string().required(),
    });
    return (
    <Formik
    validationSchema={schema}
    initialValues={{
        email:'',
        password:''
    }}
    onSubmit={onLogin}
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
            <Button onPress={()=>handleSubmit()} title="Log In" />
        </View>
        )}
    </Formik>
    )
}

const styles = StyleSheet.create({
    formField:{
        borderWidth:1,
        borderRadius:10,
        marginBottom:8,
        minWidth:200
    }
});