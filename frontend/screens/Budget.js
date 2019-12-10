import React, { Component } from 'react'
import { TextInput, SectionList, FlatList, View, Dimensions, Image, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, AsyncStorage } from 'react-native'
import { LinearGradient, MapView } from 'expo';

import { Button, Input, Block, Text } from '../components';
import { theme, mocks } from '../constants';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import CollapsibleList from "react-native-collapsible-list";

const { width, height } = Dimensions.get('window');

class Explore extends Component {
  state = {
    loading : false,
    travel_id : null,
    schedule : null,
    originalSpends : [],
    newSpends : [],
    newExpense : [],
  };

  constructor(props) {
    super(props);
    console.log(this.props)
  }

  async componentDidMount(){
    const { navigation } = this.props;
    const schedule = navigation.getParam('schedule', null);
    await this.getSpends(schedule.schedule_id);
  }

  // 원래 있던 Spends 가져오기
  async getSpends(schedule_id) {    
    let url = `http://43170294.ngrok.io/spend/getSpends/${schedule_id}`
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
    console.log("getSpends responseOK : ", responseOK);
    if (responseOK){
      let resJson = await response.json()
      let data = resJson.data
      console.log(data);

      await this.setState({ originalSpends : data });
    }   
  }

  // spend에 새로이 갱신
  async expenseUpdate(){
    const { navigation } = this.props;
    
    const schedule = navigation.getParam('schedule', null);
    const spends = navigation.getParam('spends', null);
    const price = navigation.getParam('price', null);
    console.log(schedule, spends, price);
    let url = 'http://43170294.ngrok.io/spend/expenseUpdate';
    let options = {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify({
                    schedule_id : schedule.schedule_id,
                    detail : spends,
                    expense : price
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
    const { originalSpends } = this.state;

    const travel_id = navigation.getParam('travel_id', 7);
    const schedule = navigation.getParam('schedule', null);
    const spends = navigation.getParam('spends', null);
    const price = navigation.getParam('price', null);

    var test = [];
    for(var i=0;i<spends.length;i++){
        test.push(<View key={i}>
                    <View style={{flex: 2, flexDirection:'row', alignItems: 'center', justifyContent: "space-around"}}>
                        <Text>지출내역 : </Text>
                        <Input defaultValue={" " + spends[i]} onChangeText={text => spends[i] = text}></Input>
                    </View>
                    <View style={{flex: 2, flexDirection:'row', alignItems: 'center', justifyContent: "space-around"}}>
                        <Text>지출금액 : </Text>
                        <Input defaultValue={" " + price[i]} onChangeText={text => price[i] = text}></Input>
                    </View>
                </View>
        )
    }

    return (
      <KeyboardAwareScrollView keyboardShouldPersistTaps={'always'} style={{flex:1}} showsVerticalScrollIndicator={false} enableOnAndroid={true}>
        <Block style={{borderWidth:0.5, borderColor:'green'}} padding={[0, theme.sizes.base * 2]}>
          <Text center h1 bold>스케줄 예산/지출내역</Text>
          <Text center h3>스케줄명 : { schedule.title }</Text>
          <Text center h3>스케줄 계획 : { schedule.content }</Text>
            { originalSpends ? originalSpends.map((ori, i) => 
                { return <View key={i}><Text style={{paddingHorizontal: 10}}> {ori.detail} : {ori.expense} </Text></View> }) : null 
            }
            {test}
          <Button gradient onPress={() => this.expenseUpdate()}>
            <Text bold white center>지출내역 확정하기</Text>
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
    // paddingVertical: 11,
    // paddingHorizontal: 17,
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
