import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';

import { useQuery } from '../database/realm';
import { User } from '../database/schemas';

import { LoginScreen } from '../screens/LoginScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { TaskDetailScreen } from '../screens/TaskDetailScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { CameraScreen } from '../screens/CameraScreen';
import { COLORS } from '../theme/theme';
import { ProfileScreen } from '../screens/ProfileScreen';
import { ForgotPassScreen } from '../screens/ForgotPassScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AppStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Main" component={TabNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="TaskDetail" component={TaskDetailScreen} options={{ title: 'Task Details' }} />
            <Stack.Screen name="Camera" component={CameraScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
        </Stack.Navigator>
    );
}

function TabNavigator() {
    return (
        <Tab.Navigator
            screenOptions= {({route}) => ({
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.textSecondary,
                tabBarIcon: ({ focused, color }) => {
                    let iconName;
                    if (route.name === 'Home') {
                        iconName = focused ? 'home-variant' : 'home-variant-outline';
                    } else if (route.name === 'Settings') {
                        iconName = focused ? 'cog' : 'cog-outline';
                    }

                    return (
                        <MaterialDesignIcons name={iconName} size={24} color={color} />
                    )
                }
            })}
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
            <Stack.Screen name="ForgotPass" component={ForgotPassScreen} />
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
