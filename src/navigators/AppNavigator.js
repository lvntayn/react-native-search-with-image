import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStackNavigator, StackNavigator } from 'react-navigation';
import HomeScreen from '../components/HomeScreen';
import SearchScreen from '../components/SearchScreen';
import { addListener } from '../utils/redux';


export const AppNavigator = createStackNavigator({
        Home: { screen: HomeScreen, navigationOptions: { header: null} },
        Search: { screen: SearchScreen, navigationOptions: { header: null} },
});



class AppWithNavigationState extends React.Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        nav: PropTypes.object.isRequired,
    };

    render() {
        const { dispatch, nav } = this.props;
        return (
            <AppNavigator
            navigation={{
                dispatch,
                state: nav,
                addListener
            }}
            />
        );
    }
}

const mapStateToProps = state => ({
    nav: state.nav,
});

export default connect(mapStateToProps)(AppWithNavigationState);
