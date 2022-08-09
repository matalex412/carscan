import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import AppContainer from './AppNavigator';

const App = () => {
  const [onboarded, setOnboarded] = useState();

  useEffect(() => {
    getStorage();
  }, []);

  const getStorage = async () => {
    const onboarded = await AsyncStorage.getItem('ONBOARDED');
    setOnboarded(JSON.parse(onboarded));
  };

  return <AppContainer onboarded={onboarded} />;
};

export default App;
