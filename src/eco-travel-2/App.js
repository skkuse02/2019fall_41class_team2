import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { AppLoading } from 'expo';
import { Asset } from 'expo-asset'
import * as Font from "expo-font";
import * as Icon from "@expo/vector-icons";
import AppNavigator from './AppNavigator';

export default class App extends React.Component {
  state = {
    isLoadingComplete: false
  };

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        // 최적화를 위한 expo - AppLoading : 로컬 디바이스에 필요한 파일 캐싱 
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <View style={styles.container}>
          <AppNavigator />
        </View>
      );
    }
  }

  // 로컬 디바이스에 cache할 비동기 함수 
  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/icon.png'),
        require('./assets/loading.gif'),
        require('./assets/splash.png'),
        require('./assets/username.png'),
        require('./assets/password.png'),
      ]),
      Font.loadAsync({
        ...Icon.Ionicons.font
      }),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});