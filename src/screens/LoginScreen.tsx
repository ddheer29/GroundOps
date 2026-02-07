import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Image, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
import { useRealm } from '../database/realm';
import { AuthService } from '../services/AuthService';
import { COLORS, SPACING, FONT_SIZE } from '../theme/theme';
import { useNetInfo } from '@react-native-community/netinfo';

export const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const realm = useRealm();
  const authService = new AuthService(realm);
  const netInfo = useNetInfo();
  
  const handleLogin = async () => {
    if (!netInfo.isConnected) {
        Alert.alert('Offline', 'You need internet connection to login for the first time.');
        return;
    }
    
    setLoading(true);
    try {
      await authService.login(username, password);
      // Navigation will be handled by RootNavigator reacting to user state
    } catch (error) {
      Alert.alert('Login Failed', 'Invalid credentials or network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.rootContainer}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={require('../assets/icon/appLogo.png')} style={styles.logo} />
        </View>
        <Text style={styles.title}>Login</Text>
        <View style={styles.form}>
          <TextInput 
            style={styles.input} 
            placeholder="Username / Email" 
            value={username} 
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          <TextInput 
            style={styles.input} 
            placeholder="Password" 
            value={password} 
            onChangeText={setPassword}
            secureTextEntry
          />
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>
        </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
    
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: COLORS.card,
  },
  container: {
    flex: 1,
    padding: SPACING.l,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 250,
    height: 250,
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: SPACING.l,
  },
  form: {
    padding: SPACING.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.ss,
    marginBottom: SPACING.m,
    fontSize: FONT_SIZE.m,
  },
  forgotPasswordText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.s,
    textAlign: 'center',
    marginBottom: SPACING.m,
    marginTop: SPACING.m,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.ss,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.m,
    fontWeight: '600',
  },
});
