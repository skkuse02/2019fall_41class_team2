import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Dimensions from 'Dimensions';
import {
  StyleSheet,
  KeyboardAvoidingView,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  AsyncStorage,
  Keyboard
} from 'react-native';

import UserInput from './UserInput';
import ButtonSubmit from './ButtonSubmit';

import usernameImg from '../images/username.png';
import passwordImg from '../images/password.png';

export default class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email : '',
      password : ''
    };
  }

  
  saveData =async()=>{
    const {email,password} = this.state;

      //save data with asyncstorage
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

  render() {
    return (
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
    );
  }
}

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  btnEye: {
    position: 'absolute',
    top: 55,
    right: 28,
  },
  iconEye: {
    width: 25,
    height: 25,
    tintColor: 'rgba(0,0,0,0.2)',
  },
});
