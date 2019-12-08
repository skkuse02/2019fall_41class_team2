import React, { Component } from 'react';
import { Alert, ActivityIndicator, Keyboard, StyleSheet, AsyncStorage } from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'

import { Button, Block, Input, Text } from '../components';
import { theme } from '../constants';

export default class SignUp extends Component {
  state = {
    email: null,
    username: null,
    nickname: null,
    password: null,
    errors: [],
    loading: false,
    idDuplicated: false,
    nicknameDuplicated: false,
  }

  async handleSignUp() {
    const { navigate, state } = this.props.navigation;
    const { email, username, password, nickname, idDuplicated, nicknameDuplicated } = this.state;
    const errors = [];

    // validation precheck
    if(idDuplicated || nicknameDuplicated){
      Alert.alert(
        '회원가입 실패!',
        '중복여부를 확인하세요!',
        [
          {
            text: 'OK', onPress: () => {
              navigate('SignUp', { go_back_key: state.key });
            }
          }
        ],
        { cancelable: false }
      );
      return true;
    }

    Keyboard.dismiss();
    this.setState({ loading: true });

    // check with backend API or with some static data
    let url = 'http://115.145.117.252:3000/users/signup';
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
                    username: username,
                    nickname: nickname,
                })
            };
    let response = await fetch(url, options);
    let responseOK = response && response.ok;

    if (responseOK) {
        let data = await response.json();
        this.setState({ errors, loading: false });

        if(data.result && !errors.length){
          try {
            await AsyncStorage.setItem('userToken', email);
            Alert.alert(
              '회원가입 성공!',
              'Welcome to Eco-Travel',
              [
                {
                  text: 'Continue', onPress: () => {
                    navigate('AuthLoading');
                  }
                }
              ],
              { cancelable: false }
            )
          } catch (error) {
            // Error saving data
            console.log(error);
          }
        }else{
          Alert.alert(
            '회원가입 실패!',
            '네트워크 연결을 확인하세요',
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

  async idDuplicationCheck(email){
    this.setState({ email: email })
    let url = 'http://115.145.117.252:3000/users/idDuplicationCheck';
    let options = {
      method: 'POST',
      mode: 'cors',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json;charset=UTF-8'
      },
      body: JSON.stringify({
          email: email
      })
    };

    let response = await fetch(url, options);
    let responseOK = response && response.ok;
    if (responseOK) {
        let data = await response.json();
        if(data.result == false){
          this.setState({idDuplicated: false});
        }else{
          this.setState({idDuplicated: true});
        }
    }
  }

  async nicknameDuplicationCheck(nickname){
    this.setState({ nickname: nickname })
    let url = 'http://115.145.117.252:3000/users/nicknameDuplicationCheck';
    let options = {
      method: 'POST',
      mode: 'cors',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json;charset=UTF-8'
      },
      body: JSON.stringify({
          nickname: nickname
      })
    };

    let response = await fetch(url, options);
    let responseOK = response && response.ok;
    if (responseOK) {
        let data = await response.json();
        if(data.result == false){
          this.setState({nicknameDuplicated: false});
        }else{
          this.setState({nicknameDuplicated: true});
        }
    }
  }

  IdDuplicationMsg = () => {
    let idDuplicationMsg;
    if(this.state.email){
      if(this.state.idDuplicated){
        idDuplicationMsg = (<Text h5 red>이미 존재하는 아이디입니다!</Text>)
      }else{
        idDuplicationMsg = (<Text h5 green>사용가능한 아이디입니다!</Text>)
      }
    }else{
      idDuplicationMsg = null;
    }
    return idDuplicationMsg;
  }

  NickNameDuplicationMsg = () => {
    let nicknameDuplicationMsg;
    if(this.state.nickname){
      if(this.state.nicknameDuplicated){
        nicknameDuplicationMsg = (<Text h5 red>이미 존재하는 닉네임입니다!</Text>)
      }else{
        nicknameDuplicationMsg = (<Text h5 green>사용가능한 닉네임입니다!</Text>)
      }
    }else{
      nicknameDuplicationMsg = null;
    }
    return nicknameDuplicationMsg;
  }

  render() {
    const { navigation } = this.props;
    const { loading, errors } = this.state;
    const hasErrors = key => errors.includes(key) ? styles.hasErrors : null;

    

    return (
      <KeyboardAwareScrollView keyboardShouldPersistTaps={'always'} style={{flex:1}} showsVerticalScrollIndicator={false} enableOnAndroid={true}>
        <Block padding={[0, theme.sizes.base * 2]}>
          <Text h1 bold>Sign Up</Text>
          <Block middle>
            <Input
              label="이름"
              error={hasErrors('username')}
              style={[styles.input, hasErrors('username')]}
              defaultValue={this.state.username}
              onChangeText={text => this.setState({ username: text })}
            />
            <Input
              label="닉네임"
              error={hasErrors('username')}
              style={[styles.input, hasErrors('username')]}
              defaultValue={this.state.nickname}
              onChangeText={text => this.nicknameDuplicationCheck(text)}
            />
            <this.NickNameDuplicationMsg/>
            <Input
              email
              label="아이디"
              error={hasErrors('email')}
              style={[styles.input, hasErrors('email')]}
              defaultValue={this.state.email}
              onChangeText={text => this.idDuplicationCheck(text)}
            />
            <this.IdDuplicationMsg/>
            <Input
              secure
              label="비밀번호"
              error={hasErrors('password')}
              style={[styles.input, hasErrors('password')]}
              defaultValue={this.state.password}
              onChangeText={text => this.setState({ password: text })}
            />
            <Button gradient onPress={() => {this.handleSignUp()}}>
              {loading ?
                <ActivityIndicator size="small" color="white" /> :
                <Text bold white center>Sign Up</Text>
              }
            </Button>

            <Button onPress={() => navigation.navigate('Login')}>
              <Text gray caption center style={{ textDecorationLine: 'underline' }}>
                Back to Login
              </Text>
            </Button>
          </Block>
        </Block>
      </KeyboardAwareScrollView>
    )
  }
}

const styles = StyleSheet.create({
  signup: {
    flexGrow: 1,
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
