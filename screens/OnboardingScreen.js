import React from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OnboardingScreen = ({navigation}) => {
	const finishOnboarding = async () => {
		await AsyncStorage.setItem('ONBOARDED', 'true');
		navigation.navigate('Home');
	};
	return (
		<View style={styles.container}>
			<Text>Hello</Text>
			<TouchableOpacity onPress={finishOnboarding}>
				<Text>Finished</Text>
			</TouchableOpacity>
		</View>
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
