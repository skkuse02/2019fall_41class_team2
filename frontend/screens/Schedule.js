import React, { Component } from 'react'
import { TextInput, FlatList, View, Dimensions, Image, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import { LinearGradient } from 'expo';

import { Button, Input, Block, Text } from '../components';
import { theme, mocks } from '../constants';
import TimePicker from "react-native-24h-timepicker";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'

const { width, height } = Dimensions.get('window');

function Item({schedule}){
  return (
    <View style={styles.item}>
      <Text>{schedule.date}</Text>
    </View>
  );
}

class Explore extends Component {
  state = {
    refreshing: false,
    loading: false,
    travel_id: 0,
    data: [],
    //schedule: {
      title: '',
      content: '',
      latitude: '',
      longitude: '',
      budget: 0.0,
      start_time: '',
      end_time: '',
      date: '',
      city_id: 0,
    //}
    sday: 0,
    eday: 0,
    schedule: []
  };

  async componentDidMount(){
    const { navigation } = this.props;
    const browse = navigation.getParam('browse', 'no Browse data');
    console.log(browse)
    await this.setState({travel_id: parseInt(browse.travel_id)})
    let sday = parseInt(browse.start_date.slice(8,10))
    let eday = parseInt(browse.end_date.slice(8,10))
    let day = eday - sday + 1
    console.log(sday, eday, day)
    let sche = []
    let obj = {}

    for(let i = 0; i < day; i++){
      //obj[sday+i] = []
      sche.push({
        date: sday+i,
        sche: []
      })
    }
    //sche.push(obj)
    await this.setState({schedule: sche, sday: sday, eday: eday})
    this.getSchedule();
  }
  
  async getSchedule() {    
    const { travel_id, sday, eday } = this.state;
    console.log(this.state)
    let url = `http://8f752f41.ngrok.io/schedule/getSchedule/${travel_id}`;
    
    let options = {
                method: 'GET',
                mode: 'cors',
                headers: {
                  
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8'
                }
            };
    let response = await fetch(url, options);
    
    let responseOK = response && response.ok;
    if (responseOK){
      let resJson = await response.json()
      let data = resJson.data
      console.log(data)
      for(let i = 0; i < data.length; i++){

      }
      this.setState({data: data, loading: false})
    }
  }

  // onRefresh = () => {
  //   this.getSchedule();
  // }

  render() {
    const { navigation } = this.props;
    const {loading, schedule} = this.state;
    const browse = navigation.getParam('browse', 'no Browse data');
    return (
      <KeyboardAwareScrollView keyboardShouldPersistTaps={'always'} style={{flex:1}} showsVerticalScrollIndicator={false} enableOnAndroid={true}>
        <Block padding={[0, theme.sizes.base * 2]}>
          <Text h1 bold>{browse.title}</Text>
          <Text h3>{browse.content}</Text>
          <Text h4>{browse.start_date.slice(0, 10)} ~ {browse.end_date.slice(0, 10)}{"\n"}</Text>
        
        <View style={styles.blo}>
          
        </View>
          <FlatList
            data={schedule}
            initialNumToRender={20}
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
            renderItem={({ item }) => <Item schedule = {item} />}
            keyExtractor={item => item.date}
          />
        <Button gradient onPress={() => this.addSchedule()}>
          {loading ?
            <ActivityIndicator size="small" color="white" /> : 
            <Text bold white center>추가하기</Text>
          }
        </Button>       
      </Block>
      </KeyboardAwareScrollView>
    )
  }
}

Explore.defaultProps = {
  images: mocks.explore,
};

export default Explore;

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: theme.sizes.base * 2,
    paddingBottom: theme.sizes.base * 2
  },
  search: {
    height: theme.sizes.base * 2,
    width: width - theme.sizes.base * 2,
  },
  searchInput: {
    fontSize: theme.sizes.caption,
    height: theme.sizes.base * 2,
    backgroundColor: 'rgba(142, 142, 147, 0.06)',
    borderColor: 'rgba(142, 142, 147, 0.06)',
    paddingLeft: theme.sizes.base / 1.333,
    paddingRight: theme.sizes.base * 1.5,
  },
  searchRight: {
    top: 0,
    marginVertical: 0,
    backgroundColor: 'transparent'
  },
  searchIcon: {
    position: 'absolute',
    right: theme.sizes.base / 1.333,
    top: theme.sizes.base / 1.6,
  },
  explore: {
    marginHorizontal: theme.sizes.padding * 1.25,
  },
  image: {
    minHeight: 100,
    maxHeight: 130,
    maxWidth: width - (theme.sizes.padding * 2.5),
    marginBottom: theme.sizes.base,
    borderRadius: 4,
  },
  mainImage: {
    minWidth: width - (theme.sizes.padding * 2.5),
    minHeight: width - (theme.sizes.padding * 2.5),
  },
  input: {
    borderRadius: 0,
    borderWidth: 0,
    borderBottomColor: theme.colors.gray2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginTop: -20,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    overflow: 'visible',
    alignItems: 'center',
    justifyContent: 'center',
    height: height * 0.1,
    width,
    paddingBottom: theme.sizes.base * 4,
  },
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    paddingTop: 100
  },
  text: {
    fontSize: 20,
    marginTop: 10
  },
  button: {
    backgroundColor: "#4EB151",
    paddingVertical: 11,
    paddingHorizontal: 17,
    borderRadius: 3,
    marginVertical: 50
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600"
  },
  blo: {
    height: 80,
    width: 400,
    flexDirection: 'row'
  },
  item: {
    borderRadius: 10,
    borderColor: theme.colors.gray2,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 20,
    flex: 1,
    marginVertical: 8,
  },
})
