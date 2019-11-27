import React, { Component } from 'react'
import { Animated, Dimensions, Image, FlatList, Modal, StyleSheet, ScrollView } from 'react-native';

import { Button, Block, Text } from '../components';
import { theme } from '../constants';

import axios from "axios";
import Gio from 'react-giojs';

const { width, height } = Dimensions.get('window');

class Welcome extends Component {
  static navigationOptions = {
    header: null,
  }

  scrollX = new Animated.Value(0);

  state = {
    showTerms: false,
  }

  renderTermsService() {
    return (
      <Modal animationType="slide" visible={this.state.showTerms} onRequestClose={() => this.setState({ showTerms: false })}>
        <Block padding={[theme.sizes.padding * 2, theme.sizes.padding]} space="between">
          <Text h2 light>Terms of Service</Text>

          <ScrollView style={{ marginVertical: theme.sizes.padding }}>
            <Text caption gray height={24} style={{ marginBottom: theme.sizes.base }}>
              1. Your use of the Service is at your sole risk. The service is provided on an "as is" and "as available" basis.  
            </Text>
            <Text caption gray height={24} style={{ marginBottom: theme.sizes.base }}>
              2. Support for Expo services is only available in English, via e-mail.
            </Text>
            <Text caption gray height={24} style={{ marginBottom: theme.sizes.base }}>
              3. You understand that Expo uses third-party vendors and hosting partners to provide the necessary hardware, software, networking, storage, and related technology required to run the Service.
            </Text>
            <Text caption gray height={24} style={{ marginBottom: theme.sizes.base }}>
              4. You must not modify, adapt or hack the Service or modify another website so as to falsely imply that it is associated with the Service, Expo, or any other Expo service. 
            </Text>
            <Text caption gray height={24} style={{ marginBottom: theme.sizes.base }}>
              5. You may use the Expo Pages static hosting service solely as permitted and intended to host your organization pages, personal pages, or project pages, and for no other purpose. You may not use Expo Pages in violation of Expo's trademark or other rights or in violation of applicable law. Expo reserves the right at all times to reclaim any Expo subdomain without liability to you.
            </Text>
            <Text caption gray height={24} style={{ marginBottom: theme.sizes.base }}>
              6. You agree not to reproduce, duplicate, copy, sell, resell or exploit any portion of the Service, use of the Service, or access to the Service without the express written permission by Expo.
            </Text>
            <Text caption gray height={24} style={{ marginBottom: theme.sizes.base }}>
              7. We may, but have no obligation to, remove Content and Accounts containing Content that we determine in our sole discretion are unlawful, offensive, threatening, libelous, defamatory, pornographic, obscene or otherwise objectionable or violates any party's intellectual property or these Terms of Service.
            </Text>
            <Text caption gray height={24} style={{ marginBottom: theme.sizes.base }}>
              8. Verbal, physical, written or other abuse (including threats of abuse or retribution) of any Expo customer, employee, member, or officer will result in immediate account termination.
            </Text>
            <Text caption gray height={24} style={{ marginBottom: theme.sizes.base }}>
              9. You understand that the technical processing and transmission of the Service, including your Content, may be transferred unencrypted and involve (a) transmissions over various networks; and (b) changes to conform and adapt to technical requirements of connecting networks or devices.
            </Text>
            <Text caption gray height={24} style={{ marginBottom: theme.sizes.base }}>
              10. You must not upload, post, host, or transmit unsolicited e-mail, SMSs, or "spam" messages.
            </Text>
          </ScrollView>

          <Block middle padding={[theme.sizes.base / 2, 0]}>
            <Button gradient onPress={() => this.setState({ showTerms: false })}>
              <Text center white>I understand</Text>
            </Button>
          </Block>
        </Block>
      </Modal>
    )
  }

  renderIllustrations() {
    const { illustrations } = this.props;

    return (
      <FlatList
        horizontal
        pagingEnabled
        scrollEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        snapToAlignment="center"
        data={illustrations}
        extraDate={this.state}
        keyExtractor={(item, index) => `${item.id}`}
        renderItem={({ item }) => (
          <Image
            source={item.source}
            resizeMode="cover"
            style={{ width, height: height / 2 - 20, overflow: 'visible' }}
          />
        )}
        onScroll={
          Animated.event([{
            nativeEvent: { contentOffset: { x: this.scrollX } }
          }])
        }
      />
    )
  }

  renderSteps() {
    const { illustrations } = this.props;
    const stepPosition = Animated.divide(this.scrollX, width);
    return (
      <Block row center middle style={styles.stepsContainer}>
        {illustrations.map((item, index) => {
          const opacity = stepPosition.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [0.4, 1, 0.4],
            extrapolate: 'clamp',
          });

          return (
            <Block
              animated
              flex={false}
              key={`step-${index}`}
              color="gray"
              style={[styles.steps, { opacity }]}
            />
          )
        })}
      </Block>
    )
  }

  
  render() {
    const { navigation } = this.props;
    var configs = {
      width: 400,
      height: 400,
      control: {
              stats: false,
              disableUnmentioned: false,
              lightenMentioned: false,
              inOnly: false,
              outOnly: false,
              initCountry: "CN",
              halo: true
      },
      color: {
              surface: 0xFFFFFF,
              selected: null,
              in: 0x154492,
              out: 0xDD380C,
              halo: 0xFFFFFF,
              background: null
      },
      brightness: {
              ocean: 0.5,
              mentioned: 0.5,
              related: 0.5
      }
    }

    return (
      <Block>
        <Block center bottom flex={0.4}>
          <Text h1 center bold>
            <Text h1 primary> Eco-Travel</Text>
          </Text>
          <Text h3 gray2 style={{ marginTop: theme.sizes.padding / 2, marginBottom: 20}}>
            여행을 떠날 준비가 다 되셨나요?
          </Text>
        </Block>
        <Block center middle>
          {this.renderIllustrations()}
          {this.renderSteps()}
        </Block>
        <Block middle flex={0.5} margin={[0, theme.sizes.padding * 2]}>
          <Button gradient onPress={() => navigation.navigate('Login')}>
            <Text center semibold white>Login</Text>
          </Button>
          <Button shadow onPress={() => navigation.navigate('SignUp')}>
            <Text center semibold>Signup</Text>
          </Button>
          <Button onPress={() => this.setState({ showTerms: true })}>
            <Text center caption gray>Terms of service</Text>
          </Button>
        </Block>
        {this.renderTermsService()}
      </Block>
    )
  }
}

Welcome.defaultProps = {
  illustrations: [
    { id: 1, source: require('../assets/images/welcome_3.jpg') },
    { id: 2, source: require('../assets/images/welcome_2.jpg') },
    { id: 3, source: require('../assets/images/welcome_1.jpg') },
  ],
};

export default Welcome;

const styles = StyleSheet.create({
  stepsContainer: {
    position: 'absolute',
    bottom: theme.sizes.base * 3,
    right: 0,
    left: 0,
  },
  steps: {
    width: 5,
    height: 5,
    borderRadius: 5,
    marginHorizontal: 2.5,
  },
})
 
