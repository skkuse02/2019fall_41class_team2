import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator
} from 'react-native'

export default class AuthLoadingScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#aa73b7',
    alignItems: 'center',
    justifyContent: 'center',
  },
})