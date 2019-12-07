import React, { Component } from 'react'
import { FlatList, Dimensions, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { LinearGradient } from 'expo';

import { Button, Input, Block, Text } from '../components';
import { theme, mocks } from '../constants';

const { width, height } = Dimensions.get('window');

class Explore extends Component {
  state = {
    refreshing: false,
    loading: false,
    travel_id: '',
    data: [],
  };
  
  async getSchedule() {
    let url = 'http://6eaec575.ngrok.io/schedule/getSchedule';
    this.setState({ loading: true });
    const { travel_id } = this.state;
    let options = {
                method: 'GET',
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

  onRefresh = () => {
    this.getSchedule();
  }

  render() {
    const { navigation } = this.props;
    const browse = navigation.getParam('browse', 'no Browse data');
    this.setState({ travel_id: browse });
    return (
      <Block>
        <Block flex={false} row center space="between" style={styles.header}>
          <Text h1 bold>{browse.title}</Text>
        </Block>
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
  }
})
