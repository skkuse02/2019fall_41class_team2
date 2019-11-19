import React, { Component } from 'react';
import { Router, Stack, Scene, Actions, ActionConst } from 'react-native-router-flux';
import LoginScreen from './LoginScreen';
import Signup from './Signup';

import { createSwitchNavigator } from 'react-navigation'
import AuthLoadingScreen from "./AuthLoadingScreen";

// export default class Main extends Component {
//   render() {
// 	  return (
// 	    <Router>
// 	      <Stack key="root">
// 	        <Scene key="loginScreen"
// 	          component={LoginScreen}
// 	        	animation='fade'
// 	          hideNavBar={true}
// 	          initial={true}
// 	        />
// 	        <Scene key="signup"
// 	          component={Signup}
// 	          animation='fade'
// 	          hideNavBar={true}
// 	        />
// 	      </Stack>
// 	    </Router>
// 	  );
// 	}
// }

// export default createSwitchNavigator({
// 	// screen: name
// 	AuthLoading: AuthLoadingScreen
// })