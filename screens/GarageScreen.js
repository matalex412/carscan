import React from 'react';
import {
	Text,
	View,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	Alert,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class GarageScreen extends React.Component {
	componentDidMount = () => {
		this.setup();
	};

	state = {
		cars: {},
	};

	setup = async () => {
		const onboarded = await AsyncStorage.getItem('ONBOARDED');
		console.log(onboarded);
		const id = await DeviceInfo.getUniqueId();
		let doc = await firestore().collection('Users').doc(id).get();
		if (doc.exists) {
			let data = doc.data();

			let cars = {};
			for (carId of data.garage) {
				let carDoc = await firestore().collection('Cars').doc(carId).get();
				//	console.log(carDoc.data());
				cars[carId] = carDoc.data();
			}
			this.setState({cars});
		}
	};

	showCar = carId => {
		let car = this.state.cars[carId];
		Alert.alert('Your Car', `This is a ${car.make} ${car.model}`);
		// todo show modal with stats
	};

	render() {
		return (
			<ScrollView contentContainerStyle={styles.container}>
				{this.state.cars.length > 0 ? (
					Object.keys(this.state.cars).map(carId => {
						let car = this.state.cars[carId];
						return (
							<TouchableOpacity
								onPress={() => this.showCar(carId)}
								key={carId}
								style={styles.carThumbnail}
							/>
						);
					})
				) : (
					<View>
						<Text>You haven't bought any cars yet!</Text>
					</View>
				)}
			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		justifyContent: 'center',
		flexGrow: 1,
		backgroundColor: 'white',
	},
	carThumbnail: {
		width: '80%',
		height: 100,
		backgroundColor: 'lightgrey',
		borderRadius: 5,
		margin: 10,
	},
});
