// Formik x React Native example
import React, { useState } from "react";
import {
  Button,
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
  loginUserPassword,
  loginWithGoogleCredentials,
} from "../../api/googleAuth";
import { COLORS } from "../../utils/constants";
import {
  GoogleSignin,
  GoogleSigninButton,
} from "@react-native-google-signin/google-signin";
import { CreateUser } from "../../api/authRestApi";

export const LogInForm = ({ navigation }) => {
  const onLogin = async (values) => {
    const user = await loginUserPassword(values.email, values.password);
    if (user) {
      console.log("log in exitoso");
    } else {
      console.log("log in error");
      alert("Usuario o contraseña incorrectos, por favor intenta de nuevo");
    }
  };

  const schema = yup.object().shape({
    email: yup.string().required(),
    password: yup.string().required(),
  });

  const signin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userData = await GoogleSignin.signIn();
      const user = await loginWithGoogleCredentials(userData.data.idToken);
      if (user) {
        const token = await user.user.getIdToken();
        const newUser = await CreateUser(token,userData.data.user.name);
        console.log("sign in exitoso", newUser);
      } else {
        console.log("sign in error");
        alert("sign in error")
      }
    } catch (e) {
      console.log("error", e);
      alert(e)
    }
  };

  const goToSignIn = () => {
    navigation.navigate("SignIn");
  };

  const goToRecoverPassword = () => {
    navigation.navigate("RecoverPassword");
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/chefcito.jpg")}
        style={styles.logo}
      />
      <Formik
        validationSchema={schema}
        initialValues={{ email: "", password: "" }}
        onSubmit={onLogin}
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
            <TextInput
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
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
      <GoogleSigninButton
        size={GoogleSigninButton.Size.Standard}
        color={GoogleSigninButton.Color.Dark}
        onPress={signin}
      />
      <Pressable onPress={goToRecoverPassword}>
        <Text style={styles.linkText}>¿No recuerdas tu contraseña?</Text>
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
    backgroundColor: COLORS.fondologin,
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
    borderColor: COLORS.azulClaro,
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
    backgroundColor: COLORS.botonlogin,
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
