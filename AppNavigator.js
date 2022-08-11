import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {ActivityIndicator} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CameraScreen from './screens/CameraScreen';
import ProfileScreen from './screens/ProfileScreen';
import Showroom from './screens/Showroom';
import GarageScreen from './screens/GarageScreen';
import OnboardingScreen from './screens/OnboardingScreen';

//import CoinCount from "./components/CoinCount"
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function AppTabs() {
	return (
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
			<Tab.Screen name="Profile" component={ProfileScreen} />
		</Tab.Navigator>
	);
}

const AppContainer = ({loading, onboarded}) => {
	return (
		<NavigationContainer>
			{loading ? (
				<ActivityIndicator size="large" />
			) : (
				<Stack.Navigator
					initialRouteName={!onboarded ? 'Home' : 'Onboarding'}
					screenOptions={() => ({
						headerShown: false,
					})}>
					<Stack.Screen name="Home" component={AppTabs} />
					<Stack.Screen name="Onboarding" component={OnboardingScreen} />
				</Stack.Navigator>
			)}
		</NavigationContainer>
	);
};
export default AppContainer;
