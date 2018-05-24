import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import DeviceInfo from 'react-native-device-info';
import TimerMixin from 'react-timer-mixin';
import {
    Button, StyleSheet, Text, View, StatusBar, Dimensions, Image,
    ImageBackground, TouchableOpacity, Platform
} from 'react-native';
import SearchResults from './SearchResults';
import CameraButton from './CameraButton';
import LogoSpin from './LogoSpin';
import RNFetchBlob from 'react-native-fetch-blob'
import { Config } from '../utils/config';
import { Cache } from '../utils/Cache';
import ActionSheet from 'react-native-actionsheet'


let deviceWidth = Dimensions.get('window').width;
let deviceHeight = Dimensions.get('window').height;

const model = DeviceInfo.getModel();

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7',
    },
    bg: {
        zIndex: 3,
        backgroundColor: '#41b84b',
        flex: 2
    },
    bgImage: {
        flex: 1
    },
    searchBox: {
        flex: 1,
        flexDirection: 'row',
        width: deviceWidth
    },
    headerLeft: {
        paddingTop: model == 'iPhone X' ? 50 : 30,
        paddingLeft: 10,
        width: deviceWidth * 0.2
    },
    headerCenter: {
        paddingTop: model == 'iPhone X' ? 35 : 20,
        width: deviceWidth * 0.6,
        alignItems: "center"
    },
    headerRight: {
        paddingTop: model == 'iPhone X' ? 50 : 30,
        paddingRight: 10,
        width: deviceWidth * 0.2,
        alignItems: "flex-end"
    },
    leftButton: {
        width: 25,
        height: 25,
        resizeMode: 'contain'
    },
    rightButton: {
        width: 25,
        height: 25,
        resizeMode: 'contain'
    },
    circle: {
        flex: 1,
        zIndex: 2,
        justifyContent: 'flex-start',
        flexDirection: 'column'
    },
    circleImg: {
        width: deviceWidth,
        height: deviceWidth * 0.2
    },
    results: {
        paddingTop: 40,
        flex: 22
    },
    grid: {
        flex: 1
    }
});

class SearchScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uploadedImage: this.props.navigation.getParam('imageResponse'),
            directUrl: this.props.navigation.getParam('directUrl'),
            loader: true,
            products: '',
            time: 0,
            orderBy: 'default'
        }

        this._isMounted = false;

    }

    componentWillMount() {
        this._isMounted = true;
        this.searchPhoto(this.state.uploadedImage, this.state.directUrl);
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    onImageUpload(uploadedImage, directUrl){
        if (this._isMounted == true) {
            this.setState(
              {uploadedImage: uploadedImage, directUrl: directUrl, loader: true}
            );

            console.log(uploadedImage)
            console.log(directUrl)
            this.searchPhoto(uploadedImage, directUrl);
        }
    }

    async searchPhoto(data, directUrl) {
        this.setState({loader: true});
        var start = new Date().getTime();

        if (!directUrl){
          var uri = Platform.OS === 'ios' ? data.uri.replace('file://', '') : data.uri;
          var unique_id = Math.random().toString(36).substr(2, 9);
          var postData = [
              {
                  name: 'unique_id',
                  data: unique_id
              },
              {
                  name : 'photo',
                  filename : 'search.jpg',
                  data: RNFetchBlob.wrap(uri)
              }
          ];
        }else{
          var postData = [
              {
                  name: 'unique_id',
                  data: data
              }
          ];
        }
        RNFetchBlob.fetch('POST', Config.RESTAPI_URL+'/search', {
            'Content-Type' : 'multipart/form-data',
        }, postData).then(async (response) => {
            if (this._isMounted == true) {
              var data = response.json();
              var end = new Date().getTime();
              var time = (end - start) / 1000;
              this.setState({products: data.products, loader: false, time: time});

              if (!directUrl){
                // Update caches
                var set = await this.updateCaches(unique_id);
              }
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    async updateCaches(unique_id){
      try {
        var cache = await Cache.get('search_history');
        if (cache){
          cache[cache.length] = unique_id;
          var data = cache;
        }else{
          var data = [unique_id];
        }
        var remove = await Cache.remove('search_history');
        cache = await Cache.remember('search_history', -1, data, async function(data) {
            return data;
        });
        data = await Cache.get('search_history');
      }catch(error){
        return false;
      }
    }

    showActionSheet(){
      this.ActionSheet.show()
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content" />
                <View style={styles.bg}>
                    <ImageBackground style={styles.bgImage}
                        resizeMode="cover"
                        source={require('./../../assets/search_bg.png')}>
                        <View style={styles.searchBox}>
                            <View style={styles.headerLeft}>
                                <TouchableOpacity
                                onPress={() =>
                                    this.props.dispatch(NavigationActions.back())}>
                                    <Image style={styles.leftButton}
                                      source={require('./../../assets/left_button.png')}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.headerCenter}>
                                <CameraButton
                                    type="search"
                                    defaultImage={this.state.uploadedImage}
                                    directUrl={this.state.directUrl}
                                    onImageUpload={
                                      (response, directUrl) =>
                                      this.onImageUpload(response, directUrl)
                                    }
                                 />
                            </View>
                            <View style={styles.headerRight}>
                                <TouchableOpacity
                                  onPress={() => this.showActionSheet()}>
                                    <Image style={styles.rightButton}
                                      source={require('./../../assets/filter_button.png')}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ImageBackground>
                </View>
                <View style={styles.circle}>
                    <ImageBackground resizeMode="cover" style={styles.circleImg}
                      source={require('./../../assets/circle.png')} />
                </View>
                <View style={styles.results}>
                    <View style={styles.grid}>
                        <LogoSpin status={this.state.loader} />
                        <SearchResults
                        products={this.state.products}
                        time={this.state.time}
                        orderBy={this.state.orderBy} />
                    </View>
                </View>
                <ActionSheet
                  ref={o => this.ActionSheet = o}
                  title={'Sort price by'}
                  options={['Ascending', 'Descending', 'Cancel']}
                  cancelButtonIndex={2}
                  onPress={(index) => {
                    if (index == 0){
                      this.setState({orderBy: 'ASC'})
                    }else if (index == 1){
                      this.setState({orderBy: 'DESC'})
                    }
                  }}
                />
            </View>
        );
    }
}


export default connect()(SearchScreen);
