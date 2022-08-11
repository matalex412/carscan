import React from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Onboarding from 'react-native-onboarding-swiper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import DeviceInfo from 'react-native-device-info';

const OnboardingScreen = ({navigation}) => {
	const finishOnboarding = async () => {
		const id = await DeviceInfo.getUniqueId();
		await firestore().collection('Users').doc(id).set({
			regsCaptured: [],
			coins: 0,
			garage: [],
			makesCaptured: {},
		});
		await AsyncStorage.setItem('ONBOARDED', 'true');
		navigation.navigate('Home');
	};
	return (
		<Onboarding
			onSkip={finishOnboarding}
			onDone={finishOnboarding}
			containerStyles={{padding: '10%'}}
			imageContainerStyles={{paddingBottom: 0}}
			DoneButtonComponent={() => (
				<TouchableOpacity onPress={finishOnboarding}>
					<Ionicons
						name="md-checkmark"
						size={30}
						color="black"
						style={{paddingRight: 20}}
					/>
				</TouchableOpacity>
			)}
			pages={[
				{
					backgroundColor: 'white',
					image: <Ionicons name="md-camera" color="black" size={100} />,
					title: 'Capture Vehicles',
					subtitle: 'Take pictures of cars you see to earn coins',
				},
				{
					backgroundColor: 'white',
					image: <Ionicons name="md-cash" color="black" size={100} />,
					title: 'Complete Objectives',
					subtitle: 'Find special cars each day to win prizes',
				},

				{
					backgroundColor: 'white',
					image: <Ionicons name="md-car-sport" color="black" size={100} />,
					title: 'Collect Cars',
					subtitle: 'Use coins to buy cars for your own garage',
				},
			]}
		/>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
});

export default OnboardingScreen;
