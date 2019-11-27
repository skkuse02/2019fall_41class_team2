import React, {Component} from 'react';
import {StyleSheet, Image } from 'react-native';

import logo from '../assets/eco-travel-logo.png'

export default class Wallpaper extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Image source={logo}/>
        <Text>
            Eco-Travel
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
  }
});
