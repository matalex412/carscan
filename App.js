import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import AppContainer from './AppNavigator';

const App = () => {
  const [onboarded, setOnboarded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStorage();
  }, []);

  const getStorage = async () => {
    const onboarded = await AsyncStorage.getItem('ONBOARDED');
    setOnboarded(JSON.parse(onboarded));
    setLoading(false);
  };

  return <AppContainer loading={loading} onboarded={onboarded} />;
};

export default App;
