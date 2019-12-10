import React, { Component } from 'react'
import { Dimensions, View, ActivityIndicator, Image, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage } from 'react-native'

import { Card, Badge, Button, Block, Text, TextInput, Platform, Input } from '../components';
import { theme, mocks } from '../constants';
import RNpickerSelect from 'react-native-picker-select'
import DatePicker from 'react-native-datepicker'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'

const { width } = Dimensions.get('window');

class Browse extends Component {
  state = {
    active: 'Products',
    category: '',
    title: '',
    content: '',
    total_budget: '',
    start_date: '',
    end_date: '',
    loading: false,
    country: '',
    nation: [],
    invite: ''
  }

  async addTravel() {
    const { navigate, state } = this.props.navigation;
    const { title, content, category, total_budget, start_date, end_date, country, nation, invite } = this.state;
    const errors = [];
    let uid = await AsyncStorage.getItem('uid')
    let tmp = invite +',' + uid
    let url = 'http://59ce2227.ngrok.io/travel/addTravel';
    let options = {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify({
                  category: category,
                  title: title,
                  content: content,
                  total_budget: total_budget,
                  start_date: start_date,
                  end_date: end_date,
                  country: country,
                  invite: tmp
                })
            };
    let response = await fetch(url, options);
    console.log(response)
    let responseOK = response && response.ok;

    // let urll = 'http://7d97a96e.ngrok.io/travel/addNation';
    // let optionss = {
    //             method: 'POST',
    //             mode: 'cors',
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'application/json;charset=UTF-8'
    //             }
    //         };
    // let responsee = await fetch(urll, optionss);
    // let responseOKk = responsee && responsee.ok;

    if (responseOK) {
        let data = await response.json();
        this.setState({ errors, loading: false });
        console.log(data)
        navigate('Browse', { go_back_key: state.key });
    }
  }


  renderTab(tab) {
    const { active } = this.state;
    const isActive = active === tab;

    return (
      <TouchableOpacity
        key={`tab-${tab}`}
        onPress={() => this.handleTab(tab)}
        style={[
          styles.tab,
          isActive ? styles.active : null
        ]}
      >
        <Text size={16} medium gray={!isActive} secondary={isActive}>
          {tab}
        </Text>
      </TouchableOpacity>
    )
  }

  async componentDidMount() {
    let url = 'http://59ce2227.ngrok.io/travel/getNation';
    let options = {
                method: 'GET',
                mode: 'cors',
                headers: {
                  
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8'
                }
            };
    let response = await fetch(url, options);
    
    //console.log(response.data)
    let responseOK = response && response.ok;
    let nation = []
    if (responseOK){
      let resJson = await response.json()
      let data = resJson.data
      console.log(response)
      console.log(data[0])
      for(i = 0; i < data.length ; i++){
        if(i > 0){
          if(data[i - 1].name != data[i].name)
            nation.push({'label': data[i].name, 'value': String(data[i].nation_id), 'color': '#000000'});
        }        
      }
      this.setState({nation: nation})
    }
  }

  constructor(props) {
    super(props);

    this.inputRefs = {
      firstTextInput: null,
      favSport0: null,
      favSport1: null,

      lastTextInput: null,
      favSport5: null,
    };

    

    this.statee = {
      numbers: [
        {
          label: '1',
          value: 1,
          color: 'orange',
        },
        {
          label: '2',
          value: 2,
          color: 'green',
        },
      ],
      favSport0: undefined,
      favSport1: undefined,
      favSport2: undefined,
      favSport3: undefined,
      favSport4: 'baseball',
      previousFavSport5: undefined,
      favSport5: null,
      favNumber: undefined,
    };

    this.InputAccessoryView = this.InputAccessoryView.bind(this);
  }

  InputAccessoryView() {
    return (
      <View style={defaultStyles.modalViewMiddle}>
        
      </View>
    );
  }

  render() {
    const { profile, navigation } = this.props;
    const { loading } = this.state;
    const tabs = ['Products', 'Inspirations', 'Shop'];
    const placeholder = {
      label: 'Select Category',
      value: null,
      color: '#9EA0A4'
    }
    const placeholderBudget = {
      label: 'Select Nation',
      value: null,
      color: '#9EA0A4'
    }
    return (
      <KeyboardAwareScrollView keyboardShouldPersistTaps={'always'} style={{flex:1}} showsVerticalScrollIndicator={false} enableOnAndroid={true}>
        <Block padding={[0, theme.sizes.base * 2]}>
          <Text h1 bold>Add Travel</Text>
          <RNpickerSelect
            placeholder={placeholder}
            style={{marginTop: 30}}
            onValueChange={value => {console.log(value);
              this.setState({
              category: value,
            }); console.log(value)}}
            items={[
                { label: '가족과', value: 'fam' },
                { label: '연인과', value: 'cou' },
                { label: '혼자서', value: 'alo' },
                { label: '친구와', value: 'fri' },
            ]}
            // onUpArrow={() => {
            //   this.state.category.focus();
            // }}
            // onDownArrow={() => {
            //   this.state.category.togglePicker();
            // }}
            style={pickerSelectStyles}
            value={this.state.category}
            
          />
          <Input
            style={styles.input}
            placeholder={"여행 이름"}
            defaultValue={this.state.title}
            onChangeText={text => this.setState({ title: text })}
          />
          <Input
            style={styles.input}
            placeholder={"어떤 여행인가요?"}
            defaultValue={this.state.content}
            onChangeText={text => this.setState({ content: text })}
          />
          <View style={styles.blo}>
            <Input style={{width: 300}}
              placeholder={"예산"}
              defaultValue={this.state.total_budget}
              onChangeText={text => this.setState({ total_budget: text })}
            />
            <Text style={{marginTop: 30, marginLeft: 10}}>원</Text>
          </View>
          <RNpickerSelect
            placeholder={placeholderBudget}
            style={{marginBottom: 50}}
            onValueChange={value => {console.log(value);
              this.setState({
              country: value,
            }); console.log(value)}}
            items={this.state.nation}
            // onUpArrow={() => {
            //   this.state.category.focus();
            // }}
            // onDownArrow={() => {
            //   this.state.category.togglePicker();
            // }}
            style={pickerSelectStyles}
            value={this.state.country}
            //itemKey={this.state.country}
            
          />
          <Input
            style={styles.input}
            placeholder={"함께 가는 사람(id1,id2)"}
            defaultValue={this.state.invite}
            onChangeText={text => this.setState({ invite: text })}
          />
          <DatePicker
            style={{width: 200, marginLeft: 65, marginBottom: 30, marginTop: 30}}
            date={this.state.start_date}
            mode="date"
            placeholder="Select start date"
            format="YYYY-MM-DD"
            minDate="2019-12-01"
            maxDate="2022-12-31"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              dateIcon: {
                position: 'absolute',
                left: 0,
                top: 4,
                marginLeft: 0
              },
              dateInput: {
                marginLeft: 36
              }
              // ... You can check the source to find the other keys.
            }}
            onDateChange={(date) => {this.setState({start_date: date})}}
          />
          <DatePicker
            style={{width: 200, marginLeft: 65, marginBottom: 30}}
            date={this.state.end_date}
            mode="date"
            placeholder="Select end date"
            format="YYYY-MM-DD"
            minDate="2019-12-01"
            maxDate="2022-12-31"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              dateIcon: {
                position: 'absolute',
                left: 0,
                top: 4,
                marginLeft: 0
              },
              dateInput: {
                marginLeft: 36
              }
              // ... You can check the source to find the other keys.
            }}
            onDateChange={(date) => {this.setState({end_date: date})}}
          />
          
          <Button gradient onPress={() => this.addTravel()}>
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

Browse.defaultProps = {
  profile: mocks.profile,
}

export default Browse;

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: theme.sizes.base * 2,
  },
  avatar: {
    height: theme.sizes.base * 2.2,
    width: theme.sizes.base * 2.2,
  },
  tabs: {
    borderBottomColor: theme.colors.gray2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginVertical: theme.sizes.base,
    marginHorizontal: theme.sizes.base * 2,
  },
  tab: {
    marginRight: theme.sizes.base * 2,
    paddingBottom: theme.sizes.base
  },
  active: {
    borderBottomColor: theme.colors.secondary,
    borderBottomWidth: 3,
  },
  categories: {
    flexWrap: 'wrap',
    paddingHorizontal: theme.sizes.base * 2,
    marginBottom: theme.sizes.base * 3.5,
  },
  categoryss: {
    // this should be dynamic based on screen width
    minWidth: (width - (theme.sizes.padding * 2.4) - theme.sizes.base) / 2,
    maxWidth: (width - (theme.sizes.padding * 2.4) - theme.sizes.base) / 2,
    maxHeight: (width - (theme.sizes.padding * 2.4) - theme.sizes.base) / 2,
  },
  but: {
    borderRadius: 70,
    aspectRatio: 1
  },
  input: {
    borderRadius: 0,
    borderWidth: 0,
    borderBottomColor: theme.colors.gray2,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  cen: {
    alignItems: 'center',
    position: "absolute",
    left: 181,
    top: 650
  },
  blo: {
    height: 80,
    width: 400,
    flexDirection: 'row'
  }
})

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});
