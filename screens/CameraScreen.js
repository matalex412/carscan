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
  Image,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import {useIsFocused} from '@react-navigation/core';
import DeviceInfo from 'react-native-device-info';
import firestore from '@react-native-firebase/firestore';

import {fetchVehicleData} from './../api';

const CameraScreen = () => {
  const [reg, setReg] = useState(null);
  const [photoTaken, setPhotoTaken] = useState(null);

  const identifyCar = async reg => {
    const id = await DeviceInfo.getUniqueId();
    reg = reg.replace(/\s+/g, '').toLowerCase();
    let doc = await firestore().collection('Users').doc(id).get();
    let data = doc.data();
    if (data.regsCaptured.includes(reg)) {
      Alert.alert(
        'Already Captured',
        "You've already captured the vehicle with this number plate",
      );
    } else {
      const data = await fetchVehicleData(reg.toUpperCase());

      // decide how many coins
      // check objectives
      if (data.make) {
        const string = `makesCaptured.${data.make}`;
        await firestore()
          .collection('Users')
          .doc(id)
          .update({
            regsCaptured: firestore.FieldValue.arrayUnion(reg),
            [string]: firestore.FieldValue.increment(1),
            coins: firestore.FieldValue.increment(10),
          });

        Alert.alert('Car Identified', `You found a ${data.make}!`);
      } else {
        Alert.alert('Car not identified', "Sorry couldn't identify car");
      }
    }
    setReg('');
    setPhotoTaken(false);
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

  const closeImage = () => {
    setPhotoTaken(false);
  };

  const takeSnapshot = async () => {
    const snapshot = await camera.current.takePhoto({skipMetadata: true});
    const uri = `file://${snapshot.path}`;
    setPhotoTaken(uri);
  };

  const camera = useRef<Camera>(null);
  const devices = useCameraDevices();
  const device = devices.back;
  const isFocused = useIsFocused();
  return !photoTaken ? (
    <View style={styles.backgroundStyle}>
      {device && (
        <Camera
          photo={true}
          ref={camera}
          style={styles.camera}
          device={device}
          isActive={isFocused}
        />
      )}
      <TouchableOpacity onPress={takeSnapshot} style={styles.cameraButton} />
    </View>
  ) : (
    <View style={styles.backgroundStyle}>
      <Image
        resizeMode={'cover'}
        style={styles.camera}
        source={{uri: photoTaken}}
      />
      <TouchableOpacity onPress={closeImage} style={styles.closeButton}>
        <Ionicons name="md-close" size={30} color="white" />
      </TouchableOpacity>
      <View style={styles.regInput}>
        <TextInput
          value={reg}
          onChangeText={val => setReg(val)}
          placeholder="Enter Vehicle Registration"
          style={styles.textInput}
        />
        <TouchableOpacity onPress={() => identifyCar(reg)}>
          <Ionicons name="md-send" size={30} color="white" />
        </TouchableOpacity>
      </View>
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
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  cameraButton: {
    backgroundColor: 'white',
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    position: 'absolute',
    bottom: '5%',
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  regInput: {
    position: 'absolute',
    top: '5%',
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    borderRadius: 10,
    width: '70%',
    marginRight: 10,
    backgroundColor: 'white',
  },
});

export default CameraScreen;
