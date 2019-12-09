import React, { Component } from 'react'
import { Dimensions, ActivityIndicator, Image, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage } from 'react-native'

import { Card, Badge, Button, Block, Text } from '../components';
import { theme, mocks } from '../constants';

const { width } = Dimensions.get('window');

class Browse extends Component {
  state = {
    active: 'Family',
    categories: [],
    travels: [],
    now: []
  }

  async componentDidMount() {
    this.setState({ categories: this.props.categories });
    let uid = await AsyncStorage.getItem('uid')
    let url = `http://b87ee120.ngrok.io/travel/getTravel/${uid}`;
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
    let travels = []
    if (responseOK){  
      let resJson = await response.json()
      let data = resJson.data
      //console.log(response)
      // console.log(data)
      for(i = 0; i < data.length ; i++){
        // console.log(data[i].Nation.name.toLowerCase())
        let url = `https://restcountries.eu/rest/v2/name/${data[i].Nation.name.toLowerCase()}`;
        let options = {
                    method: 'GET',
                    mode: 'cors',
                    headers: {
                      
                        'Accept': 'application/json',
                        'Content-Type': 'application/json;charset=UTF-8',
                        'fullText': true
                    }
                };
        let res = await fetch(url, options);
        let resJ = await res.json()
        let code = resJ[0].alpha2Code.toLowerCase()
        // console.log(code)
        // console.log(`https://www.countryflags.io/${code}/flat/24.png`)
        let travel = {}
        if(data[i].category == 'fri'){
          travel = {
            id: data[i].title,
            name: data[i].title,
            tags: ['Friend'],
            content: data[i].content,
            img: `https://www.countryflags.io/${code}/flat/64.png`,
            data: data[i]
          }
        } else if (data[i].category == 'fam'){
          travel = {
            id: data[i].title,
            name: data[i].title,
            tags: ['Family'],
            content: data[i].content,
            img: `https://www.countryflags.io/${code}/flat/64.png`,
            data: data[i]
          }
        } else if (data[i].category == 'alo'){
          travel = {
            id: data[i].title,
            name: data[i].title,
            tags: ['Alone'],
            content: data[i].content,
            img: `https://www.countryflags.io/${code}/flat/64.png`,
            data: data[i]
          }
        } else{
          travel = {
            id: data[i].title,
            name: data[i].title,
            tags: ['Couple'],
            content: data[i].content,
            img: `https://www.countryflags.io/${code}/flat/64.png`,
            data: data[i]
          }
        }
        
        travels.push(travel);
      }
      // console.log(travels)
      const filtered = travels.filter(
        travel => travel.tags.includes('Family')
      );

      this.setState({travels: travels, now: filtered})
    }
  }

  handleTab = tab => {
    const { categories } = this.props;
    const { travels, now } = this.state;
    // const filtered = categories.filter(
    //   category => category.tags.includes(tab.toLowerCase())
    // );
    // console.log(travels)
    const filtered = travels.filter(
      travel => travel.tags.includes(tab)
    );

    this.setState({ active: tab, now: filtered });
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

  render() {
    const { profile, navigation } = this.props;
    const { categories, travels, now } = this.state;
    const tabs = ['Family', 'Couple', 'Alone', 'Friend'];

    return (
      <Block>
        <Block flex={false} row center space="between" style={styles.header}>
          <Text h1 bold>Browse</Text>
          <Button onPress={() => navigation.navigate('Settings')}>
            <Image
              source={profile.avatar}
              style={styles.avatar}
            />
          </Button>
          <Button onPress={() => navigation.navigate('Receipt')}>
            <Text>Receipt</Text>
          </Button>
        </Block>

        <Block flex={false} row style={styles.tabs}>
          {tabs.map(tab => this.renderTab(tab))}
        </Block>

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ paddingVertical: theme.sizes.base * 2}}
        >
          <Block flex={false} row space="between" style={styles.categories}>
            {now.map(now_each => (
              <TouchableOpacity
                key={now_each.name}
                onPress={() => navigation.navigate('Explore', { browse: now_each.data })}
              >
                <Card center middle shadow style={styles.category}>
                  <Badge margin={[0, 0, 15]} size={60} color="rgba(41,216,143,0.20)">
                    
                    <Image source={{uri: now_each.img}}
       style={{width: 40, height: 40}} />
                  </Badge>
                  <Text medium height={20}>{now_each.name}</Text>
                  <Text gray caption>{now_each.content}</Text>
                </Card>
              </TouchableOpacity>
            ))}
          </Block>
        </ScrollView>
        <Block style={styles.cen}>
          <Button gradient onPress={() => navigation.navigate('AddTravel')} style={styles.but}>
            <Text bold white center>+</Text>
          </Button>
        </Block>
      </Block>
    )
  }
}

Browse.defaultProps = {
  profile: mocks.profile,
  categories: mocks.categories,
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
  category: {
    // this should be dynamic based on screen width
    minWidth: (width - (theme.sizes.padding * 2.4) - theme.sizes.base) / 2,
    maxWidth: (width - (theme.sizes.padding * 2.4) - theme.sizes.base) / 2,
    maxHeight: (width - (theme.sizes.padding * 2.4) - theme.sizes.base) / 2,
  },
  but: {
    borderRadius: 70,
    aspectRatio: 1
  },
  cen: {
    alignItems: 'center',
    position: "absolute",
    left: 181,
    top: 650
  }
})
