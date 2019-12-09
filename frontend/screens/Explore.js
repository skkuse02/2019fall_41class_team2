import React, { Component } from 'react'
import Icon from 'react-native-vector-icons';
import SocketIOClient from 'socket.io-client';

import { Animated, Dimensions, Image, StyleSheet, ScrollView, YellowBox, AsyncStorag, TextInput, FlatList, View, Dimensions, Image, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import { LinearGradient, MapView } from 'expo';

import { Button, Input, Block, Text } from '../components';
import { theme, mocks } from '../constants';
import TimePicker from "react-native-24h-timepicker";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import SearchableDropDown from 'react-native-dropdown-searchable';

const { width, height } = Dimensions.get('window');

class Explore extends Component {
  state = { 
    searchFocus: new Animated.Value(0.6),
    searchString: null,
    socket: null,
    user: null
  }

  constructor(props){
    super(props);
    YellowBox.ignoreWarnings([
      'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?'
    ]);
  }

  async componentDidMount() { 
    // 사용자 정보(아이디) 값 받아온다.
    const user = await AsyncStorage.getItem('userToken');
    this.setState({user: user});
    // 소켓 room 정보 
    const name = this.props.navigation.state.params.category.name;

    try{
      const socket = SocketIOClient('http://115.145.117.252:3000',{
        // timeout: 10000,
        // query: name,
        // jsonp: false,
        transports: ['websocket'],
        autoConnect: false,
        query: { room : name, user : this.state.user },
        // agent: '-',
        // path: '/', // Whatever your path is
        // pfx: '-',
        // key: '-', // Using token-based auth.
        // passphrase: '-', // Using cookie auth.
        // cert: '-',
        // ca: '-',
        // ciphers: '-',
        // rejectUnauthorized: '-',
        // perMessageDeflate: '-'
      });  
      socket.connect(); 
      socket.on('connect', () => { 
        console.log('connected to socket server'); 
        this.setState({socket: socket});
      }); 
      socket.on('broadcast', (data) => {
        console.log(data);
      })

    }catch{
      console.log("소켓연결 실패"); 
    }
  }

  // CRUD 소켓이벤트 발생 => 서버 수신 => 같은 socket room에 있는 유저에게 broadcast  

  handleSearchFocus(status) {
    Animated.timing(
      this.state.searchFocus,
      {
        toValue: status ? 0.8 : 0.6, // status === true, increase flex size
        duration: 150, // ms
      }
    ).start();
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
      city_id: 0,
    //}
    city: [],
    tagItem:{
      tagId: 1,
      title: 'nothing'
    },
    show: false,
    map: '',
    initLat: 37.25780000000000,
    initLon: 127.01090000000000,
    marLat: 0,
    marLon: 0,
    marker: []
  };

  async componentDidMount(){
    const { navigation } = this.props;
    const browse = navigation.getParam('browse', 'no Browse data');
    const obj = navigation.getParam('obj', 'no Browse data');
    console.log(browse)
    console.log(obj)
    let url = 'http://163fd06e.ngrok.io/schedule/getCity'
    
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
    let cities = []
    if (responseOK){
      let resJson = await response.json()
      let data = resJson.data
      console.log(data[0])
      for(i = 0; i < data.length ; i++){
        ////if(i > 0){
          //if(data[i - 1].name != data[i].name)
            cities.push({'tagId': data[i].city_id, 'title': data[i].name, 'lat': data[i].latitude, 'lon': data[i].longitude});
        //}        
      }
      await this.setState({city: cities})
    }
    //this.setState({travel_id: browse.travel_id})
    this.getSchedule();
  }
  
  async getSchedule() {
    console.log("get")
    let url = 'http://163fd06e.ngrok.io/schedule/getSchedule';
    
    const { travel_id } = this.state;
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
    let url = 'http://163fd06e.ngrok.io/schedule/addSchedule';
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
  animate(){
    console.log("anima")
    let r = {
        latitude: this.state.initLat,
        longitude: this.state.initLon,
        latitudeDelta: 7.5,
        longitudeDelta: 7.5,
    };
    this.mapView.animateToRegion(r, 2000);
  }

  makeMarker(coor){
    console.log("coor")
    console.log(coor)
    this.setState({marker: [
      {
        merchant_name: "Zaky",
        merchant_type: "Sate",
        merchant_info: "Selling Sate that is tasty",
        merchant_phone: "0812909281234",
        key: 1,
        location: {
          latitude: coor.latitude,
          longitude: coor.longitude,
        }
      }
    ], initLat: coor.latitude, initLon: coor.longitude})
  }

  renderSearch() {
    const { searchString, searchFocus } = this.state;
    const isEditing = searchFocus && searchString;

    return (
      <Block animated middle flex={searchFocus} style={styles.search}>
        <Input
          placeholder="Search"
          placeholderTextColor={theme.colors.gray2}
          style={styles.searchInput}
          onFocus={() => this.handleSearchFocus(true)}
          onBlur={() => this.handleSearchFocus(false)}
          onChangeText={text => this.setState({ searchString: text })}
          value={searchString}
          onRightPress={() => isEditing ? this.setState({ searchString: null }) : null}
          rightStyle={styles.searchRight}
          
        />
      </Block>
    )
  }

  renderImage(img, index) {
    const { navigation } = this.props;
    const {loading} = this.state;
    const browse = navigation.getParam('browse', 'no Browse data');
    return (
      <KeyboardAwareScrollView keyboardShouldPersistTaps={'always'} style={{flex:1}} showsVerticalScrollIndicator={false} enableOnAndroid={true}>
        <Block padding={[0, theme.sizes.base * 2]}>
          <Text h1 bold>{browse.date}일</Text>
          {/* <Text h1 bold>{browse.title}</Text>
          <Text h3>{browse.content}</Text>
          <Text h4>{browse.start_date.slice(0, 10)} ~ {browse.end_date.slice(0, 10)}{"\n"}</Text>
         */}
        <View style={styles.blo}>
          <Input
            style={[styles.input, {width: 170}]}
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
        <View style={styles.blo2}>
          <View style={styles.drop}>
            <SearchableDropDown
              style={styles.dropItem}
              onTextChange={tag => {
                this.setState({ tag });
              }}
            onItemSelect={item => {
                this.setState({ tagItem: item });
                console.log(item);
                this.setState({ initLat: parseFloat(item.lat)});
                this.setState({ initLon: parseFloat(item.lon)});
                this.animate();
              }}
              items={this.state.city}
              defaultIndex={0}
              resetValue={false}
              placeholder={'여행 도시'}
              placeholderTextColor={'gray'}
              underlineColorAndroid="transparent"
            />
          </View>
          <Text>{"    "}</Text>
          <TouchableOpacity
            style={{width: 100, height: 30, marginTop: 15, marginBottom: 36}}
            defaultValue={this.state.start_time}
            onChangeText={text => this.setState({ start_time: text })}
            onPress={() => this.setState({show: true})}            
            
          >
            <Input style={{width: 100, marginTop: -9, height: 40, color: "gray", borderColor: "#C5CCD6",
    borderWidth: StyleSheet.hairlineWidth, textAlign: 'center'}} editable = {false}>
              지도
            </Input>
          </TouchableOpacity>
        </View>
        {this.state.show?
          <MapView 
            style={{ flex: 1, height: 300, width: (width - theme.sizes.base * 4)}} 
            ref = {(ref)=>this.mapView=ref}
            initialRegion={{ 
              latitude: this.state.initLat, 
              longitude: this.state.initLon, 
              latitudeDelta: 0.0922, 
              longitudeDelta: 0.0421, 
            }} 
            region={{
              latitude: this.state.initLat, 
              longitude: this.state.initLon, 
              latitudeDelta: 0.0922, 
              longitudeDelta: 0.0421,
            }}
            onPress={ (event) => {console.log(event.nativeEvent.coordinate); console.log(this.state.initLat); 
              this.makeMarker(event.nativeEvent.coordinate); 
            }}
            annotations = {
              {
                latitude: 37.25780000000000,
                longitude: 127.01090000000000,
                title: 'Foo Place',
                subtitle: '1234 Foo Drive'
              }
            }
          >
            {this.state.marker.map(marker => (
                <MapView.Marker
                    coordinate={marker.location}
                    title={marker.title}
                    description={marker.description}
                    key={marker.key}
                />
            ))}
            
          </MapView>:
          <Text></Text>
        }
        

        <Button gradient onPress={() => this.addSchedule()}>
          {loading ?
            <ActivityIndicator size="small" color="white" /> : 
            <Text bold white center>추가하기</Text>
          }
        </Button>
        
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
  dropItem:{
    borderColor: theme.colors.gray2,
    borderWidth: StyleSheet.hairlineWidth,
    width: 170,
    paddingRight: 150,
    marginRight: 150
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
  drop: {
    flex: 1,
    justifyContent: 'center',
    
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
  blo2: {
    flexDirection: 'row'
  }
})
