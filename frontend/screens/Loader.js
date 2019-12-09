import React from 'react';
import LottieView from 'lottie-react-native';

export default class Loader extends React.Component {
  render() {
    return <LottieView style={{flex:1}} source={require('../assets/images/loading.json')} autoPlay loop />;
  }
}