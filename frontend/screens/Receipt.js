import React, { Component } from 'react'
import { Dimensions, View, TouchableOpacity, ScrollView, StyleSheet, Animated, ActivityIndicator, StatusBar } from 'react-native'
import * as Permissions from 'expo-permissions'
import { Camera } from 'expo-camera'

import { Button, Input, Block, Text } from '../components';

const { width, height } = Dimensions.get('window');

export default class Receipt extends Component {
    state = {
        hasCameraPermission: null,
        type: Camera.Constants.Type.back,       
        path: null,
        googleResponse: null,
        spend: [],
        price: [],
        clickedText: null,
        textClicked: false,
        loadingText: false,
        retry: false,
    };

    async componentDidMount() {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ hasCameraPermission: status === 'granted' });
    }

    takePicture = async () => {
        if (this.camera) {
            const data = await this.camera.takePictureAsync({base64: true});
            if(data){
                console.log("google");
                await this.submitToGoogle(data);
            }
        }
    };  

    submitToGoogle = async (photo) => {
        try {
            let body = JSON.stringify({
                requests: [
                {
                    features: [
                    { type: "TEXT_DETECTION" },
                    ],
                    image: {
                    content: photo.base64
                    }
                }
                ]
            });

            // 로딩으로 전환
            this.setState({loadingText : true});
            console.log("loadingText....");

            let response = await fetch(
                "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyD6wnzVBzb8mXgct3ULU96QZAglVHmfAEE"
                ,{
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: body
                }
            );
            let responseJson = await response.json();

            let test = responseJson.responses[0]["fullTextAnnotation"]["text"];
            console.log(test);
            
            // 결과값 받아옴 => 로딩 화면 off 
            if(test){
                this.setState({
                    googleResponse: test
                });
                this.setState({loadingText : false});
            }
            
        } catch (error) { 
            // 인식실패인 경우 => 다시시도해라는 페이지 
            console.log(error);
            console.log("recognition error");
            this.setState({loadingText : false, retry: true});
        }       
    };

    recordSpend = async () => {
        await this.setState((prevState) => ({spend : [...prevState.spend, this.state.clickedText]}));
        console.log(this.state.spend);
    }   

    recordPrice = async () => {
        await this.setState((prevState) => ({price : [...prevState.price, this.state.clickedText]}));
        console.log(this.state.price);
    }

    buttonPop = async (text) => {
        // 만약 prevState.clickedText가 같다면 textClicked를 반대로
        console.log(text);
        console.log(this.state);
        if(this.state.clickedText == text){
            console.log("xxxxx");
            await this.setState((prevState) => ({textClicked : !prevState.textClicked}));
        }else{
            console.log("yyyyy");
            await this.setState({textClicked : true, clickedText : text});
        }

        console.log(this.state.clickedText, this.state.textClicked);
    }   

    render() {
        const { hasCameraPermission, googleResponse, loadingText, textClicked } = this.state;
        if (hasCameraPermission === null) {
            return <View />;
        } else if (hasCameraPermission === false) {
            return <Text>No access to camera</Text>;
        } else if(googleResponse){
            // 영수증 인식되었을 경우
            var textArr = this.state.googleResponse.split("\n");
            var myloop = [];
            var selectButton = <View style={{ flex: 4, flexDirection:'row', justifyContent: 'space-around'}}><Button gradient onPress={this.recordSpend} style={{borderRadius: 50, width: 100, alignItems: 'center' }}><Text h1>지출항목</Text></Button><Button gradient onPress={this.recordPrice} style={{borderRadius: 50, width:100, alignItems: 'center'}}><Text h1>금액</Text></Button></View> 

            for (let i = 0; i < textArr.length; i++) {
                myloop.push(
                    <View key={i} style={{alignItems : 'center'}}>
                        <TouchableOpacity onPress={() => this.buttonPop(textArr[i])}>
                            <Text h3>
                                {textArr[i]}    
                            </Text>
                        </TouchableOpacity>
                    </View>
                );  
            }           

            return (
                <ScrollView>
                    <Text h2 center>인식된 텍스트중</Text>
                    <Text h3 center style={{paddingBottom: 20}}>기록할 텍스트를 눌러주세요!</Text>
                    { textClicked ? selectButton : null }
                    { myloop }      
                </ScrollView>   
            )
        } else if(loadingText){
            return <View style={{flex:1, justifyContent:'center', alignItems: 'center'}}><StatusBar hidden={true} /><ActivityIndicator size="large" color="#0000ff" /><Text h3>인식중입니다...</Text><Text h5>잠시만 기다려주세요</Text></View>
        } else {
            console.log(this.state.retry)
            var retryMsg = this.state.retry ? <View><Text style={{alignSelf: 'center'}}>다시 시도해주세요!</Text></View> : null
            return (
                <View style={{ flex: 1 }}>
                    <Camera ref={ref => {
                                    this.camera = ref;
                                }} style={{ flex: 1 }} type={this.state.type}>
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: 'transparent',
                                flexDirection: 'row',
                            }}>
                            {retryMsg}
                            <TouchableOpacity
                                onPress={this.takePicture}
                                style={{
                                    flex : 1,
                                }}>
                                <Text style={{ alignSelf: 'center', position: 'absolute', bottom: 10, borderRadius: 50, marginBottom: 10, width: 20, backgroundColor: 'red' }}></Text>
                            </TouchableOpacity>
                        </View>
                    </Camera>
                </View>
            );
        }
    }
}
