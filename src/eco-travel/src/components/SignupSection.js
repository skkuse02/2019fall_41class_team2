import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Dimensions from 'Dimensions';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {Actions} from 'react-native-router-flux';

export default class SignupSection extends Component {
  signup() {
      Actions.signup()
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Create Account</Text>
        <TouchableOpacity onPress={this.signup}><Text style={styles.text}>Signup</Text></TouchableOpacity>
      </View>
    );
  }
}

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    top: 65,
    width: DEVICE_WIDTH,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  text: {
    color: 'white',
    backgroundColor: 'transparent',
  },
});
