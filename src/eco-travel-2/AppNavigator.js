import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import {
  Scene,
  Router,
  Actions,
  Reducer,
  ActionConst,
  Overlay,
  Tabs,
  Modal,
  Drawer,
  Stack,
  Lightbox,
} from 'react-native-router-flux';
import LoginScreen from "./components/LoginScreen";

const reducerCreate = params => {
  const defaultReducer = new Reducer(params);
  return (state, action) => {
    console.log('reducer: ACTION:', action);
    return defaultReducer(state, action);
  };
};

const stateHandler = (prevState, newState, action) => {
  console.log('onStateChange: ACTION:', action);
};

const getSceneStyle = () => ({
  backgroundColor: '#F5FCFF',
  shadowOpacity: 1,
  shadowRadius: 3,
});

// on Android, the URI prefix typically contains a host in addition to scheme
const prefix = Platform.OS === 'android' ? 'mychat://mychat/' : 'mychat://';

const AppNavigator = () => (
    <Router
        createReducer={reducerCreate}
        onStateChange={stateHandler}
        getSceneStyle={getSceneStyle}
        uriPrefix={prefix}>
        <Stack key="root" hideNavBar>
            <Tabs key="Login_Signup_tab" swipeEnabled hideTabBar>
                <Scene key="Login" component={LoginScreen} hideNavBar/>
                {/* <Scene key="Signup" component={SignupScreen} title="Signup" tabBarLabel="SignUp"/> */}
            </Tabs> 
        </Stack> 
    </Router> 
);

export default AppNavigator;