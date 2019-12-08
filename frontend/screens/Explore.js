import React, { Component } from 'react'
import { Animated, Dimensions, Image, StyleSheet, ScrollView, TouchableOpacity, YellowBox, AsyncStorage } from 'react-native'
import Icon from 'react-native-vector-icons';
import { LinearGradient } from 'expo';

import { Button, Input, Block, Text } from '../components';
import { theme, mocks } from '../constants';
import SocketIOClient from 'socket.io-client';


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


  handleSearchFocus(status) {
    Animated.timing(
      this.state.searchFocus,
      {
        toValue: status ? 0.8 : 0.6, // status === true, increase flex size
        duration: 150, // ms
      }
    ).start();
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
    const sizes = Image.resolveAssetSource(img);
    const fullWidth = width - (theme.sizes.padding * 2.5);
    const resize = (sizes.width * 100) / fullWidth;
    const imgWidth = resize > 75 ? fullWidth : sizes.width * 1;

    return (
      <TouchableOpacity
        key={`img-${index}`}
        onPress={() => navigation.navigate('Product')}
      >
        <Image
          source={img}
          style={[
            styles.image,
            { minWidth: imgWidth, maxWidth: imgWidth }
          ]}
        />
      </TouchableOpacity>
    )
  }

  renderExplore() {
    const { images, navigation } = this.props;
    const mainImage = images[0];

    return (
      <Block style={{ marginBottom: height / 3 }}>
        <TouchableOpacity
          style={[ styles.image, styles.mainImage ]}
          onPress={() => navigation.navigate('Product')}
        >
          <Image source={mainImage} style={[styles.image, styles.mainImage]} />
        </TouchableOpacity>
        <Block row space="between" wrap>
          {
            images.slice(1).map((img, index) => this.renderImage(img, index))
          }
        </Block>
      </Block>
    )
  }

  renderFooter() {
    return (
      <LinearGradient
        locations={[0.5, 1]}
        style={styles.footer}
        colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.6)']}
      >
        <Button gradient style={{ width: width / 2.678 }}>
          <Text bold white center>Filter</Text>
        </Button>
      </LinearGradient>
    )
  }

  render() {
    return (
      <Block>
        <Block flex={false} row center space="between" style={styles.header}>
          <Text h1 bold>Explore</Text>
          {this.renderSearch()}
        </Block>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.explore}>
          {this.renderExplore()}
        </ScrollView>

        {this.renderFooter()}
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
