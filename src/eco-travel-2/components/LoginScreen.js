import React, {Component} from 'react';
import Logo from './Logo';
import Wallpaper from './Wallpaper';
import ButtonSubmit from './ButtonSubmit';
import usernameImg from '../assets/username.png';
import passwordImg from '../assets/password.png';
import UserInput from './UserInput';
import {
  StyleSheet,
  KeyboardAvoidingView,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  AsyncStorage,
  Keyboard,
  Dimensions
} from 'react-native';

import {Actions} from 'react-native-router-flux';

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email : '',
      password : ''
    };
  }

  // 로그인 정보 캐시화 
  saveData = async()=>{
    const {email,password} = this.state;

      let loginDetails={
          email: email,
          password: password
      }

      if(this.props.type !== 'Login')
      {
          AsyncStorage.setItem('loginDetails', JSON.stringify(loginDetails));

          Keyboard.dismiss();
          alert("You successfully registered. Email: " + email + ' password: ' + password);
          this.login();
      }
      else if(this.props.type == 'Login')
      {
          try{
              let loginDetails = await AsyncStorage.getItem('loginDetails');
              let ld = JSON.parse(loginDetails);

              if (ld.email != null && ld.password != null)
              {
                  if (ld.email == email && ld.password == password)
                  {
                      alert('Go in!');
                  }
                  else
                  {
                      alert('Email and Password does not exist!');
                  }
              }

          }catch(error)
          {
              alert(error);
          }
      }
  }

  // 회원가입 페이지로 이동 
  signup() {
    Actions.signup()
  }

  render() {
    const { navigation } = this.props;
    return (
      <Wallpaper>
        <Logo />
          <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <UserInput
              source={usernameImg}
              placeholder="email"
              onChangeText={(email) => this.setState({email})}
              autoCapitalize={'none'}
              returnKeyType={'done'}
              autoCorrect={false}
            />
            <UserInput
              source={passwordImg}
              secureTextEntry={true}
              placeholder="password"
              onChangeText={(password) => this.setState({password})} 
              returnKeyType={'done'}
              autoCapitalize={'none'}
              autoCorrect={false}
            />
          </KeyboardAvoidingView>
          <View style={styles.container2}>
            <Text style={styles.text}>Create Account</Text>
            <TouchableOpacity onPress={this.signup}><Text style={styles.text}>Signup</Text></TouchableOpacity>
          </View>
          <ButtonSubmit name="Login"/>
      </Wallpaper>
    );
  }
}

const DEVICE_WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  container2: {
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
