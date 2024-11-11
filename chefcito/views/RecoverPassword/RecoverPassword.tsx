// Formik x React Native example
import React, { useState } from "react";
import {
  TextInput,
  View,
  StyleSheet,
  Text,
  Pressable,
  Image,
} from "react-native";
import { Formik } from "formik";
import * as yup from "yup";
import {
    resetpassword,
} from "../../api/googleAuth";
import { COLORS } from "../../utils/constants";

export const RecoverPasswordForm = ({ navigation }) => {
  const recoverPassword = async (values) => {
    resetpassword(values.email)
  };

  const schema = yup.object().shape({
    email: yup.string().required(),
  });

  const goToSignIn = () => {
    navigation.navigate("SignIn");
  };

  const goToLogIn = () => {
    navigation.navigate('LogIn');
};


  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/logochefcito.jpg")}
        style={styles?.logo}
      />
      <Formik
        validationSchema={schema}
        initialValues={{ email: "" }}
        onSubmit={recoverPassword}
      >
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <View style={styles.formContainer}>
            <TextInput
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
              style={styles.formField}
              placeholder="Email"
              placeholderTextColor="#555"
            />
            <Pressable style={styles.button} onPress={() => handleSubmit()}>
              <Text style={styles.buttonText}>Recuperar Contraseña</Text>
            </Pressable>
          </View>
        )}
      </Formik>
        <Pressable onPress={goToLogIn}>
            <Text style={styles.linkText}>Ya tiene usuario, ingrese aquí</Text>
        </Pressable>
        <Pressable onPress={goToSignIn}>
            <Text style={styles.linkText}>¿No tienes cuenta? Regístrate</Text>
        </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.pastellog,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 30,
  },
  formContainer: {
    width: "100%",
    alignItems: "center",
  },
  formField: {
    borderWidth: 1,
    borderColor: COLORS.pastelborder,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    minWidth: 250,
    color: "#333",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#ffa726",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  linkText: {
    marginTop: 20,
    color: "#333",
    fontSize: 14,
  },
});
