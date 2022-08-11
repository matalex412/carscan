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
} from 'react-native';

import firestore from '@react-native-firebase/firestore';
import DeviceInfo from 'react-native-device-info';

export default class HomeScreen extends React.Component {
	state = {
		makesCaptured: {},
		ready: false,
	};

	componentDidMount() {
		this.setup();
	}

	setup = async () => {
		// read makes captured
		const id = await DeviceInfo.getUniqueId();
		let subscriber = await firestore()
			.collection('Users')
			.doc(id)
			.onSnapshot(async doc => {
				this.setState({ready: false});

				let data = doc.data();
				await this.setState({makesCaptured: data.makesCaptured});
				this.setState({ready: true});
			});
		this.setState({ready: true});
		this.setState({makesCapturedRef: subscriber});
	};

	componentWillUnmount = () => {
		const {makesCapturedRef} = this.state;
		if (makesCapturedRef) {
			makesCapturedRef();
		}
	};

	render() {
		let makes = Object.keys(this.state.makesCaptured);
		return (
			<ScrollView contentContainerStyle={styles.container}>
				{this.state.ready ? (
					makes.length > 0 ? (
						makes.map((make, id) => {
							return (
								<View style={styles.makeView} key={id}>
									<View style={styles.logo} />
									<View style={styles.statsView}>
										<Text>{make}</Text>
										<Text>Collected: {this.state.makesCaptured[make]}</Text>
										<Text>Value: 10 Coins</Text>
									</View>
								</View>
							);
						})
					) : (
						<View>
							<Text>You haven't captured any cars yet!</Text>
						</View>
					)
				) : (
					<ActivityIndicator color="black" />
				)}
			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 20,
	},
	makeView: {
		borderRadius: 5,
		width: '90%',
		padding: 10,
		flexDirection: 'row',
		elevation: 1,
		backgroundColor: 'white',
		margin: 5,
	},
	logo: {
		width: 100,
		height: 100,
		borderRadius: 3,
		backgroundColor: 'lightgrey',
	},
	statsView: {
		justifyContent: 'center',
		paddingHorizontal: 10,
		marginLeft: 10,
	},
});
