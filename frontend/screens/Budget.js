import React, { Component } from 'react'
import { TextInput, SectionList, FlatList, View, Dimensions, Image, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, AsyncStorage } from 'react-native'
import { LinearGradient, MapView } from 'expo';

import { Button, Input, Block, Text } from '../components';
import { theme, mocks } from '../constants';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import CollapsibleList from "react-native-collapsible-list";

const { width, height } = Dimensions.get('window');

function Itemm({schedule}){
  console.log("item")
  //console.log(this.props)
  //const { navigation } = this.props;
  return (
    <View>
      <TouchableOpacity style={styles.item} onPress={() => this.onSelect()}>
        <Text>{schedule.date}일</Text>
        {schedule.sche.length > 0?
          <Text>{schedule.sche}스케</Text>:
          <Text>No data</Text>
        }
        
      </TouchableOpacity>
      
    </View>
  );
}

function Item({ title }) {
  return (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

class Explore extends Component {
  state = {
    loading : false,
    travel_id : null,
    schedule : null,
    spends : [],
    isCollapsed : null,
    expense : [],
  };

  constructor(props) {
    super(props);
    console.log(this.props)
  }

  async componentDidMount(){
    const { navigation } = this.props;
    // param : travel_id, schedule entity
    const travel_id = navigation.getParam('travel_id', 7);
    const schedule = navigation.getParam('schedule', null);

    await this.setState({travel_id : travel_id, schedule : schedule });
    await this.getSpend(schedule.schedule_id);
  }

  // Spends 가져오기
  async getSchedules(schedule_id) {    
    let url = `http://203.252.34.17:3000/spend/getSpends/${schedule_id}`
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
      let spends = resJson.data
      console.log(spends);
      await this.setState({ spends : spends });

      // isCollapsed state setting
      const temp = [];
      for(let i=0;i<spends.length;i++){
        temp.push(false);
      }
      this.setState({isCollapsed, temp});
    }
  }

  // spend에 expense 갱신
  async expenseUpdate(spend_id, expense){
    let url = 'http://203.252.34.17:3000/travel/addTravel';
    let options = {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify({
                    spend_id : spend_id,
                    expense : expense
                })
            };
    let response = await fetch(url, options);
    let responseOK = response && response.ok;
    if (responseOK){
      let resJson = await response.json()
      let success = resJson.data
      console.log(success);
    }
  }

  render() {
    const { navigation } = this.props;
    const { schedule, spends, expense } = this.state;

    const spendView = [];
    for(let i=0;i<spends.length;i++){
        let view = 
            <View style={styles.collapsibleItem}>
                <MapView 
                style={{ flex: 1, height: 300, width: (width - theme.sizes.base * 4)}} 
                ref = {(ref)=>this.mapView=ref}
                initialRegion={{ 
                latitude: schedule.latitude, 
                longitude: schedule.longitude, 
                latitudeDelta: 0.0922, 
                longitudeDelta: 0.0421, 
                }} 
                annotations = {
                {
                    latitude: schedule.latitude,
                    longitude: schedule.longitude,
                    title: schedule.detail,
                    subtitle: schedule.expense
                }
                }
                />
            </View>
    }

    const spendContent = [];
    for(let i=0;i<spends.length;i++){
        let view = 
        <View style={styles.button}>
            <Text style={styles.buttonText}>{spends[i].detail}</Text>
            <Input
                style={styles.input}
                placeholder={"예산/지출을 입력해주세요"}
                defaultValue={0}
                onChangeText={text => this.setState((prevState) => ({expense : (prevState.expense[spend_id] = text)}))}
            />
            <Button gradient onPress={() => this.expenseUpdate(spend[i].spend_id, expense[spend_id])}>
                {loading ?
                    <ActivityIndicator size="small" color="white" /> : 
                    <Text bold white center>지출내역생성</Text>
                }
            </Button>
        </View>
        spendContent.push(view);
    }

    var content = 
        <CollapsibleList
            numberOfVisibleItems={1}
            wrapperStyle={styles.wrapperCollapsibleList}
            buttonContent={spendContent}
        >
        {spendView}    
        </CollapsibleList>

    return (
      <KeyboardAwareScrollView keyboardShouldPersistTaps={'always'} style={{flex:1}} showsVerticalScrollIndicator={false} enableOnAndroid={true}>
        <Block style={{borderWidth:0.5, borderColor:green}} padding={[0, theme.sizes.base * 2]}>
          <Text center h1 bold>스케줄 예산/지출내역</Text>
          <Text center h3>스케줄명 : {schedule.title}</Text>
          <Text center h3>스케줄 계획 : {schedule.content}</Text>
          {content}
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.1)"
  },
  wrapperCollapsibleList: {
    flex: 1,
    marginTop: 20,
    overflow: "hidden",
    backgroundColor: "#FFF",
    borderRadius: 5
  },
  collapsibleItem: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#CCC",
    padding: 10
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
