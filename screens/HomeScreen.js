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
			<View style={styles.container}>
				{this.state.ready ? (
					makes.map((make, id) => {
						return (
							<Text key={id}>
								{make} - {this.state.makesCaptured[make]}
							</Text>
						);
					})
				) : (
					<ActivityIndicator color="black" />
				)}

				<TouchableOpacity style={{padding: 10}} onPress={this.setup}>
					<Text>Reload</Text>
				</TouchableOpacity>
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
});
