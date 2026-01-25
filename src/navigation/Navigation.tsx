import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useQuery } from '../database/realm';
import { User } from '../database/schemas';

import { LoginScreen } from '../screens/LoginScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { TaskDetailScreen } from '../screens/TaskDetailScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { CameraScreen } from '../screens/CameraScreen';
import { COLORS } from '../theme/theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AppStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Main" component={TabNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="TaskDetail" component={TaskDetailScreen} options={{ title: 'Task Details' }} />
            <Stack.Screen name="Camera" component={CameraScreen} />
        </Stack.Navigator>
    );
}

function TabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.textSecondary,
            }}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
    );
}

function AuthStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
    );
}

export const RootNavigator = () => {
    const users = useQuery(User);
    const isLoggedIn = users.length > 0 && users[0].sessionActive;

    return (
        <>
            {isLoggedIn ? <AppStack /> : <AuthStack />}
        </>
    );
};
