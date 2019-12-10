import React from 'react';
import { Image } from 'react-native';
import { createAppContainer, createStackNavigator } from 'react-navigation';

import Welcome from '../screens/Welcome';
import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
import Forgot from '../screens/Forgot';
import Explore from '../screens/Explore';
import Browse from '../screens/Browse';
import Product from '../screens/Product';
import Settings from '../screens/Settings';

import AddTravel from '../screens/AddTravel';
import AuthLoading from '../screens/AuthLoading';
import Receipt from '../screens/Receipt';
import Schedule from '../screens/Schedule';
import DetailSchedule from '../screens/DetailSchedule';
import EditSchedule from '../screens/EditSchedule';
import Budget from '../screens/Budget';

import { theme } from '../constants';

const screens = createStackNavigator({
  Welcome,
  AuthLoading,
  Login,
  SignUp,
  Forgot,
  Explore,
  Browse,
  Product,
  Settings,
  Receipt,
  AddTravel,
  Schedule,
  DetailSchedule,
  EditSchedule,
  Budget
}, {
  defaultNavigationOptions: {
    headerStyle: {
      height: theme.sizes.base * 4,
      backgroundColor: theme.colors.white, // or 'white
      borderBottomColor: "transparent",
      elevation: 0, // for android
    },
    headerBackImage: <Image source={require('../assets/icons/back.png')} />,
    headerBackTitle: null,
    headerLeftContainerStyle: {
      alignItems: 'center',
      marginLeft: theme.sizes.base * 2,
      paddingRight: theme.sizes.base,
    },
    headerRightContainerStyle: {
      alignItems: 'center',
      paddingRight: theme.sizes.base,
    },
  }
});

export default createAppContainer(screens);