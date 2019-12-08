import React, { Component } from 'react'
import { TextInput, FlatList, View, Dimensions, Image, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import { LinearGradient } from 'expo';

import { Button, Input, Block, Text } from '../components';
import { theme, mocks } from '../constants';
import TimePicker from "react-native-24h-timepicker";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'

const { width, height } = Dimensions.get('window');

class Explore extends Component {
  state = {
    refreshing: false,
    loading: false,
    travel_id: '',
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
      travel_id: 0,
      city_id: 0
    //}
  };

  async componentDidMount(){
    const { navigation } = this.props;
    const browse = navigation.getParam('browse', 'no Browse data');
    console.log(browse)
    this.setState({travel_id: browse.travel_id})
    this.getSchedule();
  }
  
  async getSchedule() {
    console.log("get")
    
    const { travel_id } = this.state;
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
    let nation = []
    if (responseOK){
      let resJson = await response.json()
      let data = resJson.data
      console.log(response)
      console.log(data[0])
      this.setState({data: data, loading: false})
    }
  }

  async addSchedule() {
    const {schedule} = this.state
    console.log("add")
    console.log(schedule)
    let url = 'http://8f752f41.ngrok.io/schedule/addSchedule';
    this.setState({ loading: true });
    const { travel_id } = this.state;
    let options = {
                method: 'POST',
                mode: 'cors',
                headers: {
                  
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify({
                  travel_id: travel_id
                })
            };
    let response = await fetch(url, options);
    
    let responseOK = response && response.ok;
    let nation = []
    if (responseOK){
      let resJson = await response.json()
      let data = resJson.data
      console.log(response)
      console.log(data[0])
      this.setState({data: data, loading: false})
    }
  }

  onCancel() {
    this.TimePicker.close();
  }
 
  onConfirm(hour, minute) {
    this.setState({ start_time: `${hour}:${minute}` });
    this.TimePicker.close();
  }

  // onRefresh = () => {
  //   this.getSchedule();
  // }

  render() {
    const { navigation } = this.props;
    const {loading} = this.state;
    const browse = navigation.getParam('browse', 'no Browse data');
    return (
      <KeyboardAwareScrollView keyboardShouldPersistTaps={'always'} style={{flex:1}} showsVerticalScrollIndicator={false} enableOnAndroid={true}>
        <Block padding={[0, theme.sizes.base * 2]}>
          <Text h1 bold>{browse.title}</Text>
          <Text h3>{browse.content}</Text>
          <Text h4>{browse.start_date.slice(0, 10)} ~ {browse.end_date.slice(0, 10)}{"\n"}</Text>
        
        <View style={styles.blo}>
          <Input
            style={[styles.input, {width: 130}]}
            placeholder={"장소/계획"}
            defaultValue={this.state.title}
            onChangeText={text => this.setState({ title: text })}
          />
          <Text>{"  "}</Text>
          <TouchableOpacity
            style={[styles.input, {width: 100, height: 30, marginTop: 15, marginBottom: 36}]}
            placeholder={"시각"}
            defaultValue={this.state.start_time}
            onChangeText={text => this.setState({ start_time: text })}
            onPress={() => this.TimePicker.open()}            
            
          >
            <TextInput style={{width: 100, marginTop: -9}} placeholder={"시각"} editable = {false}>
              {this.state.start_time}
            </TextInput>
          </TouchableOpacity>
        </View>
        
        <Input
          style={styles.input}
          placeholder={"상세 계획"}
          defaultValue={this.state.content}
          onChangeText={text => this.setState({ content: text })}
        />
        <TouchableOpacity
          onPress={() => this.TimePicker.open()}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Start_time</Text>
        </TouchableOpacity>
        <Text style={styles.text}>{this.state.start_time}</Text>
        <TimePicker
          ref={ref => {
            this.TimePicker = ref;
          }}
          onCancel={() => this.onCancel()}
          onConfirm={(hour, minute) => this.onConfirm(hour, minute)}
        />
          <FlatList
            data={this.state.data}
            initialNumToRender={20}
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
            renderItem={({ item }) => {
              return (
                <ListItem
                  roundAvatar
                  avatar={{uri: item.avatar}}
                  title={item.name}
                />
              );
            }}
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
  }
})
