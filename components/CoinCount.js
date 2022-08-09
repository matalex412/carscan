import React from 'react';
import {TouchableOpacity, View, Text} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DeviceInfo from 'react-native-device-info';
import firestore from '@react-native-firebase/firestore';

export default class CoinCount extends React.Component {
  state = {
    coins: 0,
  };

  componentDidMount = () => {
    this.setup();
  };

  setup = async () => {
    const id = await DeviceInfo.getUniqueId();

    if (id) {
      var coinRef = await firebase
        .firestore()
        .collection('Users')
        .doc(id)
        .onSnapshot(doc => {
          var data = doc.data();
          if (data) {
            if (data.count) {
              this.setState({coins: data.count});
            }
          }
        });

      this.setState({coinRef});
    }
  };

  componentWillUnmount = () => {
    var {coinRef} = this.state;
    if (coinRef) {
      coinRef();
    }
  };

  render() {
    return (
      <View>
        <View
          style={{
            justifyContent: 'center',
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: 15,
          }}>
          <Ionicons name="md-cash-outline" size={30} color="black" />
          <Text style={{fontSize: 20, color: '#fff'}}>{this.state.stars}</Text>
        </View>
      </View>
    );
  }
}
