// Formik x React Native example
import React from 'react';
import { Button, TextInput, View, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { createUserPassword } from '../../../api/googleAuth';

export const SignInForm = () => {

    const signIn = async (values:any) => {
        const user = await createUserPassword(values.email,values.password)
        if(user) {
          console.log('sign in exitoso')
        } else {
          console.log('sign in error')
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