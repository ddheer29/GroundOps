import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useRealm } from '../database/realm';
import { AuthService } from '../services/AuthService';
import { COLORS, SPACING, FONT_SIZE } from '../theme/theme';
import { useNavigation } from '@react-navigation/native';
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
    <View style={styles.container}>
      <Text style={styles.title}>FieldSync</Text>
      <Text style={styles.subtitle}>Mobile Workforce</Text>
      
      <View style={styles.form}>
        <TextInput 
          style={styles.input} 
          placeholder="Username" 
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
        
        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading ? (
             <ActivityIndicator color="#fff" />
          ) : (
             <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.l,
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZE.m,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  form: {
    backgroundColor: COLORS.card,
    padding: SPACING.m,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: SPACING.m,
    marginBottom: SPACING.m,
    fontSize: FONT_SIZE.m,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: SPACING.m,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.m,
    fontWeight: '600',
  },
});
