import React, { Component  } from 'react';
import { connect } from 'react-redux';
import {
    Image, Text, View, ScrollView, StyleSheet, Dimensions, TouchableOpacity
} from 'react-native';
import { Col, Row, Grid } from "react-native-easy-grid";
import { Cache } from '../utils/Cache';
import { Config } from '../utils/config';
import { NavigationActions } from 'react-navigation';

var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

class LastSearch extends Component {

    constructor(props) {
        super(props)

        this.state = {
            length: 0,
            view: null
        }
    }

    componentWillMount() {
        this.fetch();
    }

    onPress(unique_id){
      this.props.dispatch(NavigationActions.navigate({
          routeName: 'Search',
          params: {
              imageResponse: unique_id,
              directUrl: true
          }
      }))
    }

    async fetch(){
      try{
        var cache = await Cache.get('search_history');
        if (cache){
          var products = [];
          for(var i = cache.length - 1; i >= 0; i--){
            products.push(
              <TouchableOpacity key={i} style={styles.imageWrap}
                onPress={this.onPress.bind(this, cache[i])}>
                <Image style={styles.image}
                  source={{uri: Config.IMAGE_URL+'/'+cache[i]+'.jpg'}}
                />
              </TouchableOpacity>
            );
            if (products.length > 10) break;
          }
          this.setState({view:
          <View style={styles.scrollWrap}>
            <Text style={styles.title}>{'Recents'}</Text>
            <ScrollView horizontal={true} style={styles.scrollView}>
              {products}
            </ScrollView>
          </View>});
        }else{
          throw new Exception();
        }
      }catch(error){
        this.setState({view:
          <View style={styles.logoWrap}>
            <Image style={styles.logo}
              source={require('./../../assets/logo.png')}
            />
        </View>});
      }

    }


    render() {
      return this.state.view;
    }

}

var productWidth = (screenWidth / 4) - 10;
const styles = StyleSheet.create({
    logoWrap: {
      flex: 1,
      paddingTop: 20,
      alignItems: 'center'
    },
    logo: {
      flex: 1,
      resizeMode: 'contain'
    },
    scrollWrap: {
      flex: 1
    },
    title: {
      marginLeft: 20,
      marginBottom: 5
    },
    scrollView: {
      flex: 1,
      paddingLeft: 5,
      paddingRight: 5
    },
    imageWrap: {
      width: productWidth,
      height: productWidth,
      marginRight: 5
    },
    image: {
      flex: 1,
      resizeMode: 'cover',
      borderRadius: productWidth / 2,
    }
});

export default connect()(LastSearch);
