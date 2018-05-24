import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import {
    Button, StyleSheet, Text, View, StatusBar, Dimensions, Image,
    ImageBackground, TouchableOpacity, Alert, ScrollView
} from 'react-native';
import CameraButton from './CameraButton';
import LastSearch from './LastSearch';
import { Config } from '../utils/config';
import TimerMixin from 'react-timer-mixin';


let deviceWidth = Dimensions.get('window').width;
let deviceHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7',
    },
    searchBox: {
        flex: 5,
        backgroundColor: 'rgba(65, 184, 75, 1)'
    },
    bgImage: {
        flex: 1
    },
    searchContent: {
        flex: 1
    },
    space: {
        flex: 1
    },
    searchText: {
        flex: 1
    },
    text1: {
        textAlign: "center",
        color: '#fff',
        fontSize: 23
    },
    text2: {
        paddingTop: 10,
        textAlign: "center",
        color: '#fff',
        fontSize: 15
    },
    buttonWrap: {
        flex: 2,
        alignItems: "center"
    },
    buttonFrame: {
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 2,
        width: deviceWidth * 0.60,
        height: deviceWidth * 0.60,
        borderRadius: (deviceWidth * 0.60) / 2,
        alignItems: "center"
    },
    buttonFrame2: {
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 2,
        width: deviceWidth * 0.50,
        height: deviceWidth * 0.50,
        borderRadius: (deviceWidth * 0.50) / 2,
        top: deviceWidth * 0.05,
        alignItems: "center"
    },
    circle: {
        flex: 1,
        justifyContent: 'flex-start',
        flexDirection: 'column'
    },
    circleImg: {
        width: deviceWidth,
        height: deviceWidth * 0.2
    },
    footer: {
        flex: 2
    },
    lastSearch: {
        flex: 3
    },
    copyright: {
        flex: 1,
        paddingTop: 10
    },
    copyrightText: {
        color: '#3f3f3f',
        textAlign: 'center'
    }
});

class HomeScreen extends Component {

    constructor(props) {
        super(props)

    }


    render() {

        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content" />
                <View style={styles.searchBox}>
                    <ImageBackground style={styles.bgImage}
                        resizeMode="cover"
                        source={require('./../../assets/home_bg.png')}>
                        <View style={styles.searchContent}>
                            <View style={styles.space}></View>
                            <View style={styles.searchText}>
                                <Text style={styles.text1}>
                                    Search product with an image!
                                </Text>
                                <Text style={styles.text2}>
                                    Please upload a photo of your product.
                                </Text>
                            </View>
                            <View style={styles.buttonWrap}>
                                <View style={styles.buttonFrame}>
                                    <View style={styles.buttonFrame2}>
                                        <CameraButton
                                        type="home" />
                                    </View>
                                </View>
                            </View>
                            <View style={styles.space}></View>
                        </View>
                    </ImageBackground>
                </View>
                <View style={styles.circle}>
                    <ImageBackground resizeMode="cover" style={styles.circleImg}
                      source={require('./../../assets/circle.png')} />
                </View>
                <View style={styles.footer}>
                    <View style={styles.lastSearch}>
                      <LastSearch />
                    </View>
                    <View style={styles.copyright}>
                        <Text style={styles.copyrightText}>
                            Designed with love by profind
                        </Text>
                    </View>
                </View>
            </View>
        );
    }
}

export default connect()(HomeScreen);
