import React from 'react';
import { AppRegistry } from 'react-native';
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(
    [
        'Remote debugger is in a background',
        'Warning: isMounted(...) is deprecated',
        'Module RCTImageLoader',
        'Class RCTCxxModule',
        'Module RNFetchBlob requires'
    ]
);
import SplashScreen from 'react-native-splash-screen'



import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';

import AppReducer from './src/reducers';
import AppWithNavigationState from './src/navigators/AppNavigator';
import { middleware } from './src/utils/redux';

const store = createStore(
  AppReducer,
  applyMiddleware(middleware),
);

class App extends React.Component {
    componentDidMount() {
        SplashScreen.hide();
    }

  render() {
    return (
      <Provider store={store}>
        <AppWithNavigationState />
      </Provider>
    );
  }
}

AppRegistry.registerComponent('App', () => App);

export default App;
