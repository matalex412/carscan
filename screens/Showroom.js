// testing
import React from 'react';
import {
	StyleSheet,
	Text,
	View,
	TextInput,
	TouchableOpacity,
	Dimensions,
	ScrollView,
	ActivityIndicator,
	Image,
} from 'react-native';

import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import DeviceInfo from 'react-native-device-info';

//import ScoreCounter from "./components/ScoreCounter"

export default class Showroom extends React.Component {
	state = {
		cars: {},
	};

	componentDidMount() {
		this.setup();
	}

	setup = async () => {
		let docs = await firestore().collection('Cars').get();

		let cars = {};
		docs.forEach(async doc => {
			cars[doc.id] = doc.data();
			const url = await storage().ref(`${doc.id}.jpg`).getDownloadURL();
			this.setState({url});
		});

		this.setState({cars});
		//console.log(cars);
	};

	buyCar = async carId => {
		const deviceId = await DeviceInfo.getUniqueId();
		let cost = this.state.cars[carId];
		firestore()
			.collection('Users')
			.doc(deviceId)
			.update({
				coins: firestore.FieldValue.increment(-cost),
				garage: firestore.FieldValue.arrayUnion(carId),
			});
		alert('added to garage');
	};

	render() {
		var width = Dimensions.get('window').width;
		return (
			<View style={styles.container}>
				{Object.keys(this.state.cars).map(carId => {
					let car = this.state.cars[carId];
					console.log(car.img);
					return (
						<View style={{borderWidth: 1}} key={carId}>
							<Image
								resizeMode={'cover'}
								style={{
									width: 100,
									height: 200,
									borderTopLeftRadius: 5,
									borderTopRightRadius: 5,
								}}
								source={{uri: this.state.url}}
							/>
							<Text>
								{car.make} {car.model}
							</Text>
							<Text>Cost: {car.cost}</Text>
							<TouchableOpacity onPress={() => this.buyCar(carId)}>
								<Text>Buy</Text>
							</TouchableOpacity>
						</View>
					);
				})}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
	dividerLine: {
		borderBottomColor: 'lightgrey',
		borderBottomWidth: 1,
		alignSelf: 'stretch',
		margin: 20,
	},
});
