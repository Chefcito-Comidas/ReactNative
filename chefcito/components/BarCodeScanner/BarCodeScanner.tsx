import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button, Modal } from "react-native";
import { CameraView, Camera } from "expo-camera";

type BarCodeScannerComponentProps = {
  cancel:()=>void;
  accept:(value:string)=>void;
  show:boolean;
}

export default function BarCodeScannerComponent({cancel,accept,show}:BarCodeScannerComponentProps) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(()=>{
    setScanned(false)
  },[show])

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  const handleBarcodeScanned = ({ type, data }) => {
    setScanned(true);
    accept(data)
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <Modal transparent={true} animationType="slide" visible={show} onRequestClose={()=>cancel()}>
      <View style={styles.container}>
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr", "pdf417"],
          }}
          style={StyleSheet.absoluteFillObject}
        />
      </View>
    </Modal>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
});