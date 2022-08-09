/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import {useIsFocused} from '@react-navigation/core';
import DeviceInfo from 'react-native-device-info';
import firestore from '@react-native-firebase/firestore';

import {fetchVehicleData} from './../api';

const CameraScreen = () => {
  const [reg, setReg] = useState(null);
  const identifyCar = async reg => {
    const data = await fetchVehicleData(reg.toUpperCase());
    const id = await DeviceInfo.getUniqueId();

    // decide how many coins
    // check objectives

    const string = `makesCaptured.${data.make}`;
    await firestore()
      .collection('Users')
      .doc(id)
      .update({
        regsCaptured: firestore.FieldValue.arrayUnion(reg),
        [string]: firestore.FieldValue.increment(1),
        coins: firestore.FieldValue.increment(5),
      });
  };

  const createAccount = async () => {
    const id = await DeviceInfo.getUniqueId();

    firestore().collection('Users').doc(id).set({
      coins: 0,
      regsCaptured: [],
      makesCaptured: {},
      garage: [],
    });
  };

  const takeSnapshot = async () => {
    const snapshot = await camera.current.takeSnapshot({
      quality: 85,
      skipMetadata: true,
    });
  };

  const camera = useRef<Camera>(null);
  const devices = useCameraDevices();
  const device = devices.back;
  const isFocused = useIsFocused();
  return (
    <View style={styles.backgroundStyle}>
      <TextInput
        value={reg}
        onChangeText={val => setReg(val)}
        placeholder="reg"
      />
      <TouchableOpacity onPress={() => identifyCar(reg)}>
        <Text>Submit</Text>
      </TouchableOpacity>

      {null && device && (
        <Camera
          ref={camera}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={isFocused}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: 'white',
  },
});

export default CameraScreen;
