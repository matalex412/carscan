import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import DeviceInfo from 'react-native-device-info';

export default class GarageScreen extends React.Component {
	componentDidMount = () => {
		this.setup();
	};

	state = {
		cars: {},
	};

	setup = async () => {
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

	render() {
		return (
			<View style={styles.backgroundStyle}>
				{Object.keys(this.state.cars).map(carId => {
					let car = this.state.cars[carId];
					return (
						<Text key={carId}>
							{car.make} {car.model}
						</Text>
					);
				})}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	backgroundStyle: {
		alignItems: 'center',
		justifyContent: 'center',
		flex: 1,
		backgroundColor: 'white',
	},
});
