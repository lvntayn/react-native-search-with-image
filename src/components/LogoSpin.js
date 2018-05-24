import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    View, Text, StyleSheet, Image, Animated, Easing
} from 'react-native';



const styles = StyleSheet.create({
    bg: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 5
    },
    bgHidden: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        alignItems: "center",
        justifyContent: "center",
        opacity: 0
    }
});


class LogoSpin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: this.props.status
        }

        this.RotateValueHolder = new Animated.Value(0);
    }

    componentDidMount() {
        this.StartImageRotateFunction();
    }

    componentWillReceiveProps(nextProps) {
        this.setState({status: nextProps.status});
    }

    StartImageRotateFunction () {
        this.RotateValueHolder.setValue(0);
        Animated.timing(
            this.RotateValueHolder,
            {
                toValue: 1,
                duration: 1500,
                easing: Easing.linear
            }
        ).start(() => this.StartImageRotateFunction())

    }

    render() {
        const RotateData = this.RotateValueHolder.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg']
        })

        return (
            <View style={this.state.status == true ? styles.bg : styles.bgHidden}>
                <Animated.Image
                style={{
                  width: 100,
                  height: 100,
                  resizeMode: 'contain',
                  transform: [{rotate: RotateData}] }}
                  source={require('./../../assets/tag.png')} />
            </View>
        );

  }
}


export default connect()(LogoSpin);
