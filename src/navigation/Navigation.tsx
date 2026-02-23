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
import { EditProfileScreen } from '../screens/EditProfileScreen';
import { ForgotPassScreen } from '../screens/ForgotPassScreen';
import { ScheduleScreen } from '../screens/ScheduleScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const tabBarIcon = ({
  focused,
  color,
  route,
}: {
  focused: boolean;
  color: string;
  route: any;
}) => {
  let iconName: string = '';
  if (route.name === 'Home') {
    iconName = focused ? 'home-variant' : 'home-variant-outline';
  } else if (route.name === 'Settings') {
    iconName = focused ? 'cog' : 'cog-outline';
  } else if (route.name === 'Schedule') {
    iconName = focused ? 'calendar' : 'calendar-outline';
  }

  return <MaterialDesignIcons name={iconName as any} size={24} color={color} />;
};

function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TaskDetail"
        component={TaskDetailScreen}
        options={{ title: 'Task Details' }}
      />
      <Stack.Screen name="Camera" component={CameraScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ title: 'Edit Profile' }}
      />
    </Stack.Navigator>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarIcon: ({ focused, color }) =>
          tabBarIcon({ focused, color, route }),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Schedule" component={ScheduleScreen} />
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

import { setAuthToken } from '../api/axios';

export const RootNavigator = () => {
  const users = useQuery(User);
  const isLoggedIn = users.length > 0 && users[0].sessionActive;

  React.useEffect(() => {
    if (isLoggedIn && users[0].token) {
      setAuthToken(users[0].token);
    } else {
      setAuthToken(null);
    }
  }, [isLoggedIn, users]);

  return <>{isLoggedIn ? <AppStack /> : <AuthStack />}</>;
};
