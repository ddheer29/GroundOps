import React from 'react';
import { View, Text, StyleSheet, Button, Alert, TouchableOpacity } from 'react-native';
import { useRealm, useQuery } from '../database/realm';
import { User, SyncQueue } from '../database/schemas';
import { AuthService } from '../services/AuthService';
import { SyncService } from '../services/SyncService';
import { COLORS, SPACING } from '../theme/theme';
import { navigate } from '../utils/NavigationUtil';

export const SettingsScreen = () => {
  const realm = useRealm();
  const authService = new AuthService(realm);
  const syncService = new SyncService(realm);
  const user = useQuery(User)[0];
  const pendingSyncs = useQuery(SyncQueue).length;

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Logout',
        onPress: async () => {
          await authService.logout();
        },
      },
    ]);
  };

  const handleForceSync = async () => {
      await syncService.syncPendingChanges();
      await syncService.pullLatestData();
      Alert.alert('Sync', 'Sync process triggered.');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.section} onPress={() => navigate('Profile')}>
          <Text style={styles.header}>Account</Text>
          <Text style={styles.info}>Logged in as: {user?.username}</Text>
      </TouchableOpacity>

      <View style={styles.section}>
          <Text style={styles.header}>Sync</Text>
          <Text style={styles.info}>Pending changes: {pendingSyncs}</Text>
          <Button title="Force Sync" onPress={handleForceSync} />
      </View>
      
      <View style={styles.section}>
          <Text style={styles.header}>App Info</Text>
          <Text style={styles.info}>Version: 0.0.1</Text>
      </View>
      <Button title="Logout" onPress={handleLogout} color={COLORS.danger} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.m,
  },
  section: {
    backgroundColor: COLORS.card,
    padding: SPACING.m,
    borderRadius: 8,
    marginBottom: SPACING.m,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: SPACING.s,
  },
  info: {
      marginBottom: SPACING.m,
      fontSize: 16,
  }
});
