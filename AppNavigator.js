import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import CameraScreen from './screens/CameraScreen';
import HomeScreen from './screens/HomeScreen';
import Showroom from './screens/Showroom';
import GarageScreen from './screens/GarageScreen';

//import CoinCount from "./components/CoinCount"
const Tab = createBottomTabNavigator();

function AppContainer() {
	return (
		<NavigationContainer>
			<Tab.Navigator
				screenOptions={({route}) => ({
					tabBarIcon: ({color, size}) => {
						let iconName;

						if (route.name === 'Camera') {
							iconName = 'md-camera';
						} else if (route.name === 'Garage') {
							iconName = 'md-car-sport';
						} else if (route.name === 'Profile') {
							iconName = 'md-person';
						} else {
							iconName = 'md-cart';
						}

						return <Ionicons name={iconName} size={size} color={color} />;
					},
					headerShown: false,
					tabBarShowLabel: false,
				})}>
				<Tab.Screen name="Camera" component={CameraScreen} />
				<Tab.Screen name="Garage" component={GarageScreen} />
				<Tab.Screen name="Shop" component={Showroom} />
				<Tab.Screen name="Profile" component={HomeScreen} />
			</Tab.Navigator>
		</NavigationContainer>
	);
}

export default AppContainer;
