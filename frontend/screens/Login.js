import React, { Component } from 'react'
import { Alert, ActivityIndicator, Keyboard, StyleSheet, AsyncStorage, Image } from 'react-native'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'

import { Button, Block, Input, Text } from '../components';
import { theme } from '../constants';

export default class Login extends Component {
  state = {
    email: null,
    password: null,
    errors: [],
    loading: false,
  }

  async handleLogin() {
    const { navigate, state } = this.props.navigation;
    const { email, password } = this.state;
    const errors = [];

    Keyboard.dismiss();
    this.setState({ loading: true });

    // check with backend API or with some static data
    let url = 'http://115.145.118.37:3000/users/login';
    let options = {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                })
            };
    let response = await fetch(url, options);
    let responseOK = response && response.ok;

    if (responseOK) {
        let data = await response.json();
        this.setState({ errors, loading: false });
        if(data.result && !errors.length){
          try {
            await AsyncStorage.setItem('userToken', 'Logined');
            await AsyncStorage.setItem('uid', email);
            let tmp = await AsyncStorage.getAllKeys();
            console.log(tmp)
            let t = await AsyncStorage.getItem('uid')
            console.log(t)
            navigate('AuthLoading');
          } catch (error) {
            // Error saving data
            console.log(error);
          }
        }else{
          Alert.alert(
            '로그인 실패!',
            '아이디 또는 비밀번호를 확인하세요',
            [
              {
                text: 'OK', onPress: () => {
                  navigate('SignUp', { go_back_key: state.key });
                }
              }
            ],
            { cancelable: false }
          )
        }
    }
  }

  render() {
    const { navigation } = this.props;
    const { loading, errors } = this.state;
    const hasErrors = key => errors.includes(key) ? styles.hasErrors : null;

    return (
      <KeyboardAwareScrollView keyboardShouldPersistTaps={'always'} style={{flex:1}} showsVerticalScrollIndicator={false} enableOnAndroid={true}>
        <Block padding={[0, theme.sizes.base * 2]}>
          <Text h1 bold>Login</Text>
          <Block middle>
            <Input
              label="아이디"
              error={hasErrors('email')}
              style={[styles.input, hasErrors('email')]}
              placeholder={"아이디를 입력해주세요"}
              defaultValue={this.state.email}
              onChangeText={text => this.setState({ email: text })}
            />
            <Input
              secure
              label="비밀번호"
              error={hasErrors('password')}
              style={[styles.input, hasErrors('password')]}
              placeholder={"비밀번호를 입력해주세요"}
              defaultValue={this.state.password}
              onChangeText={text => this.setState({ password: text })}
            />
            <Button gradient onPress={() => this.handleLogin()}>
              {loading ?
                <ActivityIndicator size="small" color="white" /> : 
                <Text bold white center>로그인</Text>
              }
            </Button>
            <Button onPress={() => navigation.navigate('Forgot')}>
              <Text gray caption center style={{ textDecorationLine: 'underline' }}>
                비밀번호 찾기
              </Text>
            </Button>            
          </Block>
        </Block>
      </KeyboardAwareScrollView>
    )
  }
}

const styles = StyleSheet.create({
  login: {
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    borderRadius: 0,
    borderWidth: 0,
    borderBottomColor: theme.colors.gray2,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  hasErrors: {
    borderBottomColor: theme.colors.accent,
  }
})
