import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { RealmProvider } from './database/realm';
import { RootNavigator } from './navigation/Navigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
        <RealmProvider fallback={<LoadingFallback />}>
            <NavigationContainer>
                <RootNavigator />
            </NavigationContainer>
        </RealmProvider>
    </SafeAreaProvider>
  );
}

const LoadingFallback = () => (
    <React.Fragment>
        {/* Simple Splash */}
    </React.Fragment>
);

export default App;
