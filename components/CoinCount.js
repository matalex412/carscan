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
      var coinRef = await firestore()
        .collection('Users')
        .doc(id)
        .onSnapshot(doc => {
          if (doc.exists) {
            var data = doc.data();
            if (data.coins) {
              this.setState({coins: data.coins});
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
      <View style={this.props.style}>
        <View
          style={{
            justifyContent: 'center',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Ionicons name="md-cash-outline" size={30} color="black" />
          <Text style={{marginLeft: 5}}>{this.state.coins}</Text>
        </View>
      </View>
    );
  }
}
