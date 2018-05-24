import React, { Component  } from 'react';
import {
    Image, Text, View, ScrollView, StyleSheet, Dimensions,
    TouchableOpacity, Linking
} from 'react-native';
import { Col, Row, Grid } from "react-native-easy-grid";

var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

export default class SearchResults extends Component {

    constructor(props) {
        super(props)

        this.state = {
            productView: null,
            msgView: []
        }

    }

    componentWillReceiveProps(nextProps) {
        this.fetch(nextProps.products, nextProps.time, nextProps.orderBy);
    }

    componentDidMount() {
        this.fetch(this.props.products);
    }

    render() {
        return (
            <ScrollView>
                <View style={{paddingLeft: 3, flexDirection: 'row'}}>
                    {this.state.msgView}
                </View>
                <Grid>
                    {this.state.productView}
                </Grid>
            </ScrollView>
        )
    }

    fetch(products, time, orderBy) {
      if (this.state.productView !== null && (!products || products.length == 0)){
        var noResult =
        <Text style={styles.length}>
          {'Your photo did not match any products.'}
        </Text>;
        this.setState({length: 0, productView: noResult, msgView: []})
        return false;
      }

      var msgView = []
      msgView.push(
        <Text style={styles.length} key={0}>
          {products.length > 0 ? 'About '+products.length+' products' : ''}
        </Text>)
      msgView.push(
        <Text style={styles.seconds} key={1}>
          {products.length > 0 ? '(' + time + ' seconds)' : ''}
        </Text>)
      this.setState({
        msgView: msgView
      });

      var list = [];
      var col1 = [];
      var col2 = [];
      var product;


      if (orderBy !== 'default'){
        products = [].concat(products)
        .sort((a, b) => {
          if (orderBy == 'ASC'){
            return parseFloat(a.price) - parseFloat(b.price);
          }
          return parseFloat(b.price) - parseFloat(a.price);
        });
      }

      for(var i=0; i<products.length;i++){
        var data = products[i];
        if (data.currency == 'TRY'){
          price = data.price + ' TL';
        }else{
          price = '$' + data.price;
        }
        product = <View style={styles.productWrap} key={i}>
            <Image
                style={styles.productImage}
                source={{uri: data.image}}
            />
            <View style={styles.productContent}>
                <View style={styles.producTitleWrap}>
                    <Text
                    style={styles.producTitle}
                    numberOfLines={3}
                    ellipsizeMode={'tail'}>
                        {data.name}
                    </Text>
                </View>
                <View style={styles.productPriceWrap}>
                    <Text style={styles.productPrice}>{price}</Text>
                    <Text style={styles.productDiscount}>{'('+data.discount+'% off)'}</Text>
                </View>
                <Text style={styles.productMerchant}>{data.merchant}</Text>
                <TouchableOpacity
                  onPress={ ()=>{ Linking.openURL(data.url)}}
                  style={styles.productButtonWrap}>
                    <View style={styles.productButton}>
                        <View style={styles.productButtonIconWrap}>
                            <Image style={styles.productButtonIcon}
                              source={require('./../../assets/cart_icon.png')}
                            />
                        </View>
                        <Text style={styles.productButtonTitle}>{'BUY IT NOW'}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>;
        if (i % 2 == 0){
          col1.push(product);
        }else{
          col2.push(product);
        }

      }

      list.push(
      <Col key={i} style={styles.col1}>
          {col1}
      </Col>);
      list.push(
      <Col key={i + 1} style={styles.col2}>
          {col2}
      </Col>);
      this.setState({productView: list})
    }
}

var productHeight = screenWidth / 1.3;
const styles = StyleSheet.create({
    length: {
        padding: 5
    },
    seconds: {
        padding: 5,
        fontStyle: 'italic'
    },
    col1: {
        paddingLeft: 10,
        paddingRight: 5,
        paddingTop: 10
    },
    col2: {
        paddingLeft: 5,
        paddingRight: 10,
        paddingTop: 10
    },
    productWrap: {
        height: productHeight,
        backgroundColor: '#ffffff',
        borderColor: '#dbdbdb',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 10
    },
    productImage: {
        flex: 6,
        borderRadius: 10,
        resizeMode: 'cover'
    },
    productContent: {
        flex: 4
    },
    producTitleWrap: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    producTitle: {
        textAlign: 'center',
        paddingLeft: 5,
        paddingRight: 5,
        alignSelf: "center"
    },
    productPriceWrap: {
        flex: 2,
        flexDirection: "row",
        alignItems: "center"
    },
    productPrice: {
        flex: 1,
        textAlign: 'right',
        color: '#a80707',
        paddingRight: 2,
        fontWeight: 'bold'
    },
    productDiscount: {
        flex: 1,
        textAlign: 'left',
        paddingLeft: 2,
        fontSize: 12,
        paddingTop: 1
    },
    productMerchant: {
        flex: 2,
        textAlign: 'center'
    },
    productButtonWrap: {
        flex: 3,
        paddingBottom: 5
    },
    productButton: {
        width: '70%',
        borderWidth: 2,
        borderColor: 'rgba(65, 184, 75, 1)',
        borderRadius: 5,
        flexDirection: "row",
        alignSelf: "center",
        alignItems: "center"
    },
    productButtonIconWrap: {
        flex: 2,
        padding: 5
    },
    productButtonIcon: {
        height: 18,
        width: 18,
        resizeMode: "contain",
        alignSelf: "flex-end"
    },
    productButtonTitle: {
        flex: 8,
        fontSize: 13,
        color: 'rgba(65, 184, 75, 1)',
        fontWeight: 'bold',
        textAlign: 'left'
    }
});
