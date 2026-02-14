import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { RealmProvider } from './database/realm';
import { RootNavigator } from './navigation/Navigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { navigationRef } from './utils/NavigationUtil';
import Toast from './utils/Toast';

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <RealmProvider fallback={<LoadingFallback />}>
        <NavigationContainer ref={navigationRef}>
          <RootNavigator />
        </NavigationContainer>
      </RealmProvider>
      <Toast />
    </SafeAreaProvider>
  );
}

const LoadingFallback = () => (
  <React.Fragment>{/* Simple Splash */}</React.Fragment>
);

export default App;
