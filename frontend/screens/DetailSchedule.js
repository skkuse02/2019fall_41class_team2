import React, { Component } from 'react'
import { TextInput, SectionList, FlatList, View, Dimensions, YellowBox, Image, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, AsyncStorage } from 'react-native'
import { LinearGradient, MapView } from 'expo';

import { Button, Input, Block, Text } from '../components';
import { theme, mocks } from '../constants';
import TimePicker from "react-native-24h-timepicker";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import SocketIOClient from 'socket.io-client';

const { width, height } = Dimensions.get('window');
const markerColor = ['red', 'yellow', 'green', 'blue']

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
    schedule: [],
    marker: [],
    show: false,
    initLat: 37.25780000000000,
    initLon: 127.01090000000000,
    socket: null,
    socketMsg: null
  };

  async componentDidMount(){
    const { navigation } = this.props;
    console.log("detail")
    const browse = navigation.getParam('browse', 'no Browse data');
    console.log(browse)
    const obj = navigation.getParam('obj', 'no Browse data');
    this.getSchedule(obj); 

    // 사용자 정보(아이디) 값 받아온다.
    const email = await AsyncStorage.getItem('uid');
    // 소켓 room 정보 

    try{
      const socket = SocketIOClient('http://203.252.34.17:3000',{
        // timeout: 10000,
        // query: name,
        // jsonp: false,
        transports: ['websocket'],
        autoConnect: false,
        query: { room : browse.travel_id, userEmail : email },
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

    }catch(e){
      console.log(e);
      console.log("소켓연결 실패"); 
    }
  }

  async componentWillReceiveProps() {
    const { navigation } = this.props;
    console.log("detail")
    const browse = navigation.getParam('browse', 'no Browse data');
    console.log(browse)
    const obj = navigation.getParam('obj', 'no Browse data');
    this.getSchedule(obj);
  }
  
  constructor(props) {
    super(props);
    YellowBox.ignoreWarnings([
      'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?',

    ]);
  }

  async getSchedule(obj) {    
    const { travel_id, sday, eday, schedule } = this.state;
    const date = obj + 'T00:00:00.000Z'
    console.log(date)
    //console.log(this.state)
    let url = `http://43170294.ngrok.io/schedule/getDateSchedule/${date}`
    
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
        this.state.schedule.push({
          "title": `${data[i].start_time.slice(0,5)}  ${data[i].title}`,
          "data": [
            data[i]
          ]
        })
        this.state.marker.push({
          title: data[i].title,
          description: data[i].content,
          key: i+1,
          location: {
            latitude: parseFloat(data[i].latitude),  
            longitude: parseFloat(data[i].longitude),
          }
        })
      }
      console.log(schedule)
      console.log(this.state.marker)
      if(data.length != 0)
        this.setState({data: data, loading: false, initLat: parseFloat(data[0].latitude), initLon: parseFloat(data[0].longitude)})
      
    }
  }

  // onRefresh = () => {
  //   this.getSchedule();
  // }
  onSelect(){
    console.log("select")
    const { navigation } = this.props;
    navigation.navigate('Explore', { browse: schedule, travel: browse })
  }

  makeMarker(coor){
    console.log(this.state.marker)
    console.log("coor")
    console.log(coor)
    this.setState({marker: [
      {
        title: '여행 예정지',
        description: `Here is ${Number((coor.latitude).toFixed(4))}, ${Number((coor.longitude).toFixed(4))}`,
        key: 1,
        location: {
          latitude: coor.latitude,  
          longitude: coor.longitude,
        }
      }
    ], initLat: coor.latitude, initLon: coor.longitude})
  }

  render() {
    const { navigation } = this.props;
    const {loading, schedule} = this.state;
    const browse = navigation.getParam('browse', 'no Browse data');
    const obj = navigation.getParam('obj', 'no Browse data');
    return (
      <KeyboardAwareScrollView keyboardShouldPersistTaps={'always'} style={{flex:1}} showsVerticalScrollIndicator={false} enableOnAndroid={true}>
        <Block padding={[0, theme.sizes.base * 2]}>
          <View style={styles.blo}>
            <Text h1 bold>{obj} 일정    </Text>  
            { !this.state.show ?
              <TouchableOpacity style={styles.item1} onPress={() => this.setState({show: true})}>
                <Text>지도</Text>
              </TouchableOpacity>:
              <TouchableOpacity style={styles.item1} onPress={() => this.setState({show: false})}>
                <Text>접기</Text>
              </TouchableOpacity>
            }
            
            <Text>   </Text>
            <Button gradient onPress={() => navigation.navigate('Explore', {browse: browse, obj: obj})} style={styles.but}>
              <Text bold white center>+</Text>
            </Button>  
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
            {this.state.marker.map(mark => (
                <MapView.Marker
                    coordinate={mark.location}
                    title={mark.title}
                    description={mark.description}
                    key={mark.key}
                    pinColor={'#000000'}
                />
            ))}
            
          </MapView>:
          <Text></Text>
        }
        <SectionList
          sections={schedule}
          renderSectionHeader={({ section }) => (
            <View>
                  <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('EditSchedule', { browse: browse, obj: obj, sid: section.data[0].schedule_id })}>
                    
            <Text h3 bold style={styles.SectionHeaderStyle}> {section.title}</Text>
            </TouchableOpacity>
                  
                </View>
          )}
          renderItem={({ item }) => (
            // Single Comes here which will be repeatative for the FlatListItems
            <View>
              <Text 
                style={{marginLeft: 35, fontSize: 17}}
                //Item Separator View
                >
                {item.content}
              </Text>
              <View style={styles.blo}>
              <Text
                style={{marginLeft: 20, fontSize: 17, color: 'red'}}
                //Item Separator View
                >
                예산: {item.budget}원
              </Text>
              <Text
                style={{marginHorizontal: 20, fontSize: 17, color: 'blue'}}
                //Item Separator View
                >
                지출: 0원
              </Text>
              <TouchableOpacity style={styles.item2} onPress={() => navigation.navigate('Receipt', {browse: browse, obj: obj, travel_id: browse.travel_id, schedule: item})}>
                    
              <Text h style={styles.SectionHeaderStyle}>추가</Text>
              </TouchableOpacity>
              </View>
            </View>
            
          )}
          keyExtractor={(item, index) => index}
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
    flexDirection: 'row',
    marginTop: 8
  },
  item: {
    borderRadius: 10,
    borderColor: theme.colors.primary,
    borderWidth: 1.5,
    padding: 20,
    flex: 1,
    marginTop: 10,
  },
  item1: {
    borderRadius: 10,
    borderColor: theme.colors.gray2,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 5,
    paddingHorizontal: 10,
    height: 30,
    marginTop: 9
  },
  item2: {
    borderRadius: 10,
    borderColor: theme.colors.gray2,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 5,
    paddingHorizontal: 10,
    height: 30
  },
  but: {
    borderRadius: 70,
    aspectRatio: 1,
    height: 33
  },
})
