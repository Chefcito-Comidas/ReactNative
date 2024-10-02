import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';

// Definir un tipo personalizado que incluya las props del componente Text y los children
interface CustomTextProps extends TextProps {
  children: React.ReactNode; // Esto asegura que los children están bien definidos
}

// Componente Text personalizado que aplicará la fuente global
const CustomText: React.FC<CustomTextProps> = (props) => {
  return <Text {...props} style={[styles.defaultFont, props.style]}>{props.children}</Text>;
}

const styles = StyleSheet.create({
  defaultFont: {
    fontFamily: 'Montserrat-VariableFont_wght', // Asegúrate que este nombre coincide con el de tu fuente
  },
});

export default CustomText;
