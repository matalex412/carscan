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
	Alert,
} from 'react-native';

import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import DeviceInfo from 'react-native-device-info';
import Ionicons from 'react-native-vector-icons/Ionicons';

import CoinCount from './../components/CoinCount';

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
			//			const url = await storage().ref(`${doc.id}.jpg`).getDownloadURL();
			//			this.setState({url});
		});

		this.setState({cars});
		//console.log(cars);
	};

	buyCar = async carId => {
		const deviceId = await DeviceInfo.getUniqueId();
		let cost = this.state.cars[carId].cost;
		firestore()
			.collection('Users')
			.doc(deviceId)
			.update({
				coins: firestore.FieldValue.increment(-cost),
				garage: firestore.FieldValue.arrayUnion(carId),
			});
		Alert.alert('Car Bought!', 'This car has been added to your garage');
	};

	render() {
		var width = Dimensions.get('window').width;
		return (
			<ScrollView contentContainerStyle={styles.contentContainer}>
				<View style={[styles.horizontalView, {width: '80%'}]}>
					<Text style={{fontsize: 25}}>Showroom</Text>
					<CoinCount />
				</View>
				<View style={styles.itemContainer}>
					{Object.keys(this.state.cars).map(carId => {
						let car = this.state.cars[carId];
						return (
							<TouchableOpacity
								onPress={() => this.buyCar(carId)}
								style={styles.carBox}
								key={carId}>
								{/*<Image
								resizeMode={'cover'}
								style={{
									width: 100,
									height: 200,
									borderTopLeftRadius: 5,
									borderTopRightRadius: 5,
								}}
								source={{uri: this.state.url}}
							/>*/}
								<View
									style={{
										width: width / 2 - 30,
										height: width / 2 - 30,
										backgroundColor: 'lightgrey',
										borderRadius: 5,
									}}></View>
								<View style={styles.horizontalView}>
									<Text>
										{car.make} {car.model}
									</Text>
									<TouchableOpacity onPress={() => this.buyCar(carId)}>
										<Text>${car.cost}</Text>
									</TouchableOpacity>
								</View>
							</TouchableOpacity>
						);
					})}
				</View>
			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({
	contentContainer: {
		flexGrow: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#fff',
	},
	horizontalView: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: 5,
	},
	carBox: {
		borderRadius: 5,
		backgroundColor: 'white',
		elevation: 1,
		margin: 10,
	},
	coinCount: {
		position: 'absolute',
		top: 10,
		right: 10,
	},
	itemContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'center',
		marginBottom: 15,
	},
});
