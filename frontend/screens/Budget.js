import React, { Component } from 'react'
import { TextInput, SectionList, FlatList, View, Dimensions, Image, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, AsyncStorage } from 'react-native'
import { LinearGradient, MapView } from 'expo';

import { Button, Input, Block, Text } from '../components';
import { theme, mocks } from '../constants';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import CollapsibleList from "react-native-collapsible-list";
import SearchableDropDown from 'react-native-dropdown-searchable';

const { width, height } = Dimensions.get('window');

class Explore extends Component {
  state = {
    loading : false,
    travel_id : null,
    schedule : null,
    originalSpends : [],
    newSpends : [],
    idx : [],
    prevCur: [],
    nextCur: [],
    tagItem:{
      tagId: 1,
      title: 'nothing'
    },
    nextItem:{
      tagId: 1,
      title: 'nothing'
    },
    currency: false,
    newSpend:[]
  };

  constructor(props) {
    super(props);
  }

  async componentDidMount(){
    console.log("budget")
    const { navigation } = this.props;
    const schedule = navigation.getParam('schedule', null);
    const price = navigation.getParam('price', null);
    const spends = navigation.getParam('spends', null);

    let tmp = ''
    let tmp1 = ''
    let tmp2 = ''
    let tmpSpend = []
    for(let i = 0; i < price.length; i++){
      tmp = price[i].replace(/,/gi, '')
      tmp1 = tmp.replace(/ /gi, '')
      //tmp2 = tmp1.replace(/\./gi, '')
      tmp2 = tmp1.replace(/$/gi, '')
      this.state.idx.push(i+1)
      tmpSpend.push({
        'spend': spends[i],
        'price': tmp2
      })
    }
    console.log(this.state.idx)
    console.log(tmpSpend)
    await this.setState({newSpends: spends, newSpend: tmpSpend})
    console.log(this.state.newSpends)
    console.log(this.state.newSpend)
    this.getSpends(schedule.schedule_id);
    this.getCurrency()
  }

  // 원래 있던 Spends 가져오기
  async getSpends(schedule_id) {    
    let url = `http://5862ece5.ngrok.io/spend/getSpends/${schedule_id}`
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
      console.log(data[0]);

      await this.setState({ originalSpends : data });
    }   
  }

  async getCurrency(){
    let nowDate = new Date();
    let yesterDate = nowDate.getTime() - (1*24*60*60*1000);
    nowDate.setTime(yesterDate)

    let yesterYear = nowDate.getFullYear();
    let yesterMonth = nowDate.getMonth() + 1
    let yesterDay = nowDate.getDate()

    if(yesterMonth < 10){ yesterMonth = '0'+yesterMonth}
    if(yesterDay < 10){yesterDay = '0' + yesterDay}

    let yesterday = yesterYear + '-' +yesterMonth+"-"+yesterDay;

    let url = `https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=7mSymobPkiSfiRnnwY4kdHZmMvysMxgz&searchdate=${yesterday}&data=AP01`;
    
    let response = await fetch(url);
    let responseOK = response && response.ok;
    if (responseOK){
      let data = await response.json()
      //console.log(data)
      for(let i = 0; i < data.length; i++){
        this.state.prevCur.push({'tagId': data[i].cur_unit, 'title': data[i].cur_nm, 'withwon': data[i].deal_bas_r});
      }
      this.setState({nextCur: this.state.prevCur})
    }
  }

  // spend에 새로이 갱신
  async expenseUpdate(){
    const { navigation } = this.props;
    
    const schedule = navigation.getParam('schedule', null);
    const spends = navigation.getParam('spends', null);
    const price = navigation.getParam('price', null);
    console.log(schedule, spends, price);
    console.log(this.state.newSpend)
    let currency = ''
    if(this.state.nextItem.tagId == 1){
      currency = this.state.tagItem.tagId
    } else {
      currency = this.state.nextItem.tagId
    }

    console.log(currency)

    let url = 'http://5862ece5.ngrok.io/spend/expenseUpdate';
    let options = {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify({
                    schedule_id : schedule.schedule_id,
                    expense : this.state.newSpend,
                    currency: currency
                })
            };
    let response = await fetch(url, options);
    let responseOK = response && response.ok;
    if (responseOK){
      let resJson = await response.json()
      let success = resJson.data
      console.log(success);
      
    }
    const browse = navigation.getParam('browse', 'no browse data');
    const obj = navigation.getParam('obj', 'no obj data');
    navigation.navigate('DetailSchedule', {browse: browse, obj: obj})
  }

  async exchange() {
    let {newSpend} = this.state
    console.log('exchchc')
    console.log(this.state.tagItem)
    console.log(this.state.nextItem)
    console.log(this.state.currency)
    const cur = this.state.tagItem.tagId+this.state.nextItem.tagId
    console.log(cur)
    let url = `https://earthquake.kr:23490/query/${cur}`;    
    let response = await fetch(url);
    
    let responseOK = response && response.ok;
    if (responseOK){
      let resJson = await response.json()
      console.log(resJson)
      let data = resJson[cur][0]
      console.log(data)
      for (let i =0; i<newSpend.length; i++){
        newSpend[i].price = (newSpend[i].price*data).toFixed(1).toString()
      } 
      console.log(newSpend)
      this.setState({newSpend})
      this.setState({currency: true})
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
    // for(var i=0;i<spends.length;i++){
    //     test.push(<View key={i}>
    //                 <View style={{flex: 2, flexDirection:'row', alignItems: 'center', justifyContent: "space-around"}}>
                        
    //                     <Input defaultValue={" " + this.state.newSpends[i]} onChangeText={text => this.state.newSpends[i-1] = text} style={{paddingHorizontal: 10}}></Input>
    //                     <Text> : </Text>
    //                 <Input defaultValue={" " + this.state.newExpense[i]} onChangeText={text => this.state.newExpense[i-1] = text} style={{paddingHorizontal: 10}}></Input>
    //                 </View>
    //             </View>
    //     )
    // }

    return (
      <KeyboardAwareScrollView keyboardShouldPersistTaps={'always'} style={{flex:1}} showsVerticalScrollIndicator={false} enableOnAndroid={true}>
        <Block padding={[0, theme.sizes.base * 2]}>
          <Text h1 bold>스케줄 지출내역</Text>
          <Text h3>스케줄명 : { schedule.title }</Text>
          <Text h3>스케줄 계획 : { schedule.content }{"\n"}</Text>
            { originalSpends ? originalSpends.map((ori, i) => 
                { return <View key={i} style={{flexDirection: 'row'}}><Text style={{paddingHorizontal: 10}}> {ori.detail} : {ori.expense}</Text>{ori.currency != '1'? <Text>{ori.currency}</Text>: null}</View> }) : null 
            }
          <View style={styles.blo}>
          <SearchableDropDown
              style={[styles.dropItem, {width: 100}]}
              onTextChange={tag => {
                this.setState({ tag });
              }}
            onItemSelect={item => {
                this.setState({ tagItem: item });
                console.log(item);
              }}
              items={this.state.prevCur}
              defaultIndex={0}
              resetValue={false}
              placeholder={'현재 화폐'}
              placeholderTextColor={'gray'}
              underlineColorAndroid="transparent"
            />
            <TouchableOpacity style={styles.item1} onPress={() => {this.exchange()}}>
              <Text>환전</Text>
            </TouchableOpacity>
          </View>
          <SearchableDropDown
              style={[styles.dropItem, {width: 100, marginBottom: 15}]}
              onTextChange={tag2 => {
                this.setState({ tag2 });
              }}
            onItemSelect={item => {
                this.setState({ nextItem: item });
                console.log(item);
              }}
              items={this.state.nextCur}
              defaultIndex={0}
              resetValue={false}
              placeholder={'환전 화폐'}
              placeholderTextColor={'gray'}
              underlineColorAndroid="transparent"
            />
              <FlatList
                data={this.state.newSpend}
                initialNumToRender={20}
                extraData={this.state}
                renderItem={({ item, index }) => {
                  return (                    
                    <View style={{flex: 2, flexDirection:'row', alignItems: 'center', justifyContent: "space-around", marginTop: 23}}>                        
                        <Input onChangeText={text => {let {newSpend} = this.state; console.log(newSpend[index]); newSpend[index].spend = text; this.setState({newSpend})}} style={styles.item2} defaultValue={this.state.newSpend[index].spend}/>
                        <Text> : </Text>
                    <Input style={styles.item2} onChangeText={text => {let {newSpend} = this.state; newSpend[index].price = text; this.setState({newSpend}); console.log(this.state.newSpend[index])}} defaultValue={item.price}></Input>
                    {(this.state.tagItem.tagId != '1' && this.state.nextItem.tagId != '1' && this.state.currency)? <Text>{this.state.nextItem.tagId}</Text>: null}
                    {(this.state.tagItem.tagId != '1' && this.state.nextItem.tagId == '1')? <Text>{this.state.tagItem.tagId}</Text>: null}
                    </View>
                  );
                }}
              />
          <Button gradient onPress={() => this.expenseUpdate()} style ={{marginTop: 20}}>
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
    width: 400,
    flexDirection: 'row',
    marginTop: 20
  },
  item: {
    borderRadius: 10,
    borderColor: theme.colors.gray2,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 20,
    flex: 1,
    marginVertical: 8,
  },
  dropItem:{
    borderColor: theme.colors.gray2,
    borderWidth: StyleSheet.hairlineWidth,
    width: 100,
    paddingRight: 150,
    marginRight: 150
  },
  drop: {
    flex: 1,
    justifyContent: 'center',
    
  },
  item1: {
    borderRadius: 10,
    borderColor: theme.colors.gray2,
    borderWidth: StyleSheet.hairlineWidth,
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 20,
    height: 40,
    marginTop: 15,
    marginLeft: 40
  },
  item2: {
    borderRadius: 7,
    borderColor: 'gray',
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignSelf: 'flex-end',
    fontSize: 13
  },
})
