import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    View, StyleSheet, Image, TouchableOpacity, Dimensions, Text,
    Platform
} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import { NavigationActions } from 'react-navigation';
import ImagePicker from 'react-native-image-picker';
import PropTypes from 'prop-types';
import { Config } from '../utils/config';


let deviceWidth = Dimensions.get('window').width;
let deviceHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    button: {
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        width: deviceWidth * 0.40,
        height: deviceWidth * 0.40,
        borderRadius: (deviceWidth * 0.40) / 2,
        top: deviceWidth * 0.05,
        shadowColor: '#181c17',
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowRadius: 30,
        shadowOpacity: 1,
        alignItems: "center"
    },
    cameraIcon: {
        width: deviceWidth * 0.20,
        height: deviceWidth * 0.20,
        top: deviceWidth * 0.10,
        opacity: 0.9
    },
    photo: {
        width: deviceWidth * 0.36,
        height: deviceWidth * 0.36,
        borderRadius: (deviceWidth * 0.36) / 2,
        top: deviceWidth * 0.02
    },
    buttonSmall: {
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        shadowColor: '#181c17',
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowRadius: 30,
        shadowOpacity: 1,
        alignItems: "center",
        width: deviceWidth * 0.23,
        height: deviceWidth * 0.23,
        borderRadius: (deviceWidth * 0.23) / 2,
        alignItems: "center",
        justifyContent: "center"
    },
    cameraIconSmall: {
        width: deviceWidth * 0.13,
        height: deviceWidth * 0.13,
        opacity: 0.9
    },
    photoSmall: {
        width: deviceWidth * 0.19,
        height: deviceWidth * 0.19,
        borderRadius: (deviceWidth * 0.19) / 2
    }
});


class CameraButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: this.props.type,
            imageSource: null,
            options: ['Take Photo', 'Choose from Library', 'Cancel'],
            test: ''
        }

        if (this.props.defaultImage !== undefined){
            this.state.directUrl = this.props.directUrl;
            if (this.props.directUrl){
              this.state.imageSource = {
                  uri: Config.IMAGE_URL+'/'+this.props.defaultImage+'.jpg'
              };
            }else{
              var response = this.props.defaultImage;
              var source = {
                  uri: Platform.OS === 'ios' ? response.uri.replace('file://', '') : response.uri
              };
              this.state.imageSource = source;
            }
        }
    }

    showActionSheet() {
        this.ActionSheet.show();
    }

    uploadPhoto(response) {
        if (response.didCancel) {
            console.log('User cancelled image picker');
        }else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
        }else{
            var source = {
                uri: Platform.OS === 'ios' ? response.uri.replace('file://', '') : response.uri
            };

            if (this.state.type == 'home'){
                this.props.dispatch(NavigationActions.navigate({
                    routeName: 'Search',
                    params: {
                        imageResponse: response,
                        directUrl: false
                    }
                }));
            }else{
                this.setState({imageSource: source, directUrl: false});
            }

            if (this.props.onImageUpload !== undefined){
                this.props.onImageUpload(response, this.state.directUrl);
            }
        }
    }

    takePhoto() {
        var options = {
            storageOptions: {
                skipBackup: true
            }
        };
        ImagePicker.launchCamera(options, (response)  => {
            this.uploadPhoto(response);
        });
    }

    chooseFromLibrary() {
        var options = {
            storageOptions: {
                skipBackup: true
            }
        };
        ImagePicker.launchImageLibrary(options, (response)  => {
            this.uploadPhoto(response);
        });
    }

    render() {
        if (this.state.imageSource == null){
            var image = <Image style={this.state.type == 'home' ? styles.cameraIcon : styles.cameraIconSmall}
              source={require('./../../assets/camera_icon.png')}
            />
        }else{
            var image = <Image style={this.state.type == 'home' ? styles.photo : styles.photoSmall}
              source={this.state.imageSource}
            />
        }


        return (
          <View>
              <TouchableOpacity
              onPress={this.showActionSheet.bind(this)}>
                  <View style={this.state.type == 'home' ? styles.button : styles.buttonSmall}>
                      {image}
                  </View>
              </TouchableOpacity>
              <ActionSheet
                  ref={o => this.ActionSheet = o}
                  title={'Upload an Photo'}
                  options={this.state.options}
                  cancelButtonIndex={this.state.options.length - 1}
                  destructiveButtonIndex={-1}
                  onPress={(index) => {
                      if (index == 0){
                          this.takePhoto();
                      }else if (index == 1) {
                          this.chooseFromLibrary();
                      }
                  }}
                />
          </View>
      );
  }
}


export default connect()(CameraButton);
