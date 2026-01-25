import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { useRealm, useQuery } from '../database/realm';
import { Task } from '../database/schemas';
import { COLORS, SPACING, FONT_SIZE } from '../theme/theme';
import { SyncService } from '../services/SyncService';
import { useNavigation } from '@react-navigation/native';
import { useNetInfo } from '@react-native-community/netinfo';

export const HomeScreen = () => {
  const realm = useRealm();
  const tasks = useQuery(Task).sorted('updatedAt', true);
  const navigation = useNavigation<any>();
  const syncService = new SyncService(realm);
  const netInfo = useNetInfo();
  
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (netInfo.isConnected) {
        syncService.pullLatestData();
        syncService.syncPendingChanges();
    }
  }, [netInfo.isConnected]);

  const onRefresh = async () => {
    setRefreshing(true);
    if (netInfo.isConnected) {
        await syncService.pullLatestData();
    }
    setRefreshing(false);
  };

  const renderItem = ({ item }: { item: Task }) => (
    <TouchableOpacity 
      style={styles.taskCard} 
      onPress={() => navigation.navigate('TaskDetail', { taskId: item._id })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.cardLocation}>{item.location}</Text>
      <View style={styles.cardFooter}>
          <Text style={styles.priority}>{item.priority}</Text>
          <Text style={styles.date}>{new Date(item.updatedAt).toLocaleDateString()}</Text>
          {!item.isSynced && <Text style={styles.unsynced}>⚠️ Pending Sync</Text>}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {!netInfo.isConnected && (
          <View style={styles.offlineBanner}>
            <Text style={styles.offlineText}>You are offline. Changes will sync later.</Text>
          </View>
      )}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
            <View style={styles.emptyContainer}>
                <Text>No tasks assigned.</Text>
            </View>
        }
      />
    </View>
  );
};

const getStatusColor = (status: string) => {
    switch(status) {
        case 'Pending': return COLORS.statusPending;
        case 'In Progress': return COLORS.statusInProgress;
        case 'Completed': return COLORS.statusCompleted;
        default: return COLORS.textSecondary;
    }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    padding: SPACING.m,
  },
  taskCard: {
    backgroundColor: COLORS.card,
    padding: SPACING.m,
    borderRadius: 8,
    marginBottom: SPACING.m,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  cardTitle: {
    fontSize: FONT_SIZE.m,
    fontWeight: 'bold',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: SPACING.s,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  cardLocation: {
    color: COLORS.textSecondary,
    marginBottom: SPACING.s,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.s,
  },
  priority: {
     fontWeight: '600',
     color: COLORS.textSecondary,
  },
  date: {
      color: COLORS.textSecondary,
      fontSize: 12,
  },
  unsynced: {
      color: COLORS.warning,
      fontSize: 12,
      fontWeight: 'bold',
  },
  offlineBanner: {
      backgroundColor: COLORS.text,
      padding: SPACING.s,
      alignItems: 'center',
  },
  offlineText: {
      color: COLORS.white,
      fontSize: 12,
  },
  emptyContainer: {
      alignItems: 'center',
      marginTop: SPACING.xl,
  }
});
