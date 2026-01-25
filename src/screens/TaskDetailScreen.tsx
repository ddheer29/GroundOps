import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useObject, useRealm } from '../database/realm';
import { Task, SyncQueue } from '../database/schemas';
import { COLORS, SPACING, FONT_SIZE } from '../theme/theme';
import { useRoute, useNavigation } from '@react-navigation/native';

export const TaskDetailScreen = () => {
  const route = useRoute<any>();
  const { taskId } = route.params;
  const task = useObject(Task, taskId);
  const realm = useRealm();
  const navigation = useNavigation<any>();
  
  const [noteText, setNoteText] = useState(task?.notes || '');

  if (!task) {
      return (
          <View style={styles.container}>
              <Text>Task not found</Text>
          </View>
      );
  }

  const updateStatus = (newStatus: string) => {
      realm.write(() => {
          task.status = newStatus;
          task.updatedAt = new Date();
          task.isSynced = false;
          
          // Add to Sync Queue
          const payload = {
              _id: task._id,
              status: newStatus,
          };
          
          realm.create('SyncQueue', {
              _id: new Realm.BSON.ObjectId(),
              operation: 'UPDATE',
              targetId: task._id,
              collection: 'Task',
              payload: JSON.stringify(payload),
              timestamp: new Date(),
          });
      });
  };

  const saveNotes = () => {
     realm.write(() => {
         task.notes = noteText;
         task.updatedAt = new Date();
         task.isSynced = false;
         
         const payload = {
            _id: task._id,
            notes: noteText,
        };
        
        realm.create('SyncQueue', {
            _id: new Realm.BSON.ObjectId(),
            operation: 'UPDATE',
            targetId: task._id,
            collection: 'Task',
            payload: JSON.stringify(payload),
            timestamp: new Date(),
        });
     });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
          <Text style={styles.title}>{task.title}</Text>
          <Text style={styles.label}>Location: <Text style={styles.value}>{task.location}</Text></Text>
          <Text style={styles.label}>Description: <Text style={styles.value}>{task.description}</Text></Text>
          <Text style={styles.label}>Priority: <Text style={styles.value}>{task.priority}</Text></Text>
      </View>

      <View style={styles.section}>
          <Text style={styles.sectionHeader}>Status: {task.status}</Text>
          <View style={styles.buttonRow}>
              <TouchableOpacity onPress={() => updateStatus('Pending')} style={[styles.statusBtn, task.status === 'Pending' && styles.activeBtn]}>
                  <Text style={styles.btnText}>Pending</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => updateStatus('In Progress')} style={[styles.statusBtn, task.status === 'In Progress' && styles.activeBtn]}>
                  <Text style={styles.btnText}>In Progress</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => updateStatus('Completed')} style={[styles.statusBtn, task.status === 'Completed' && styles.activeBtn]}>
                  <Text style={styles.btnText}>Completed</Text>
              </TouchableOpacity>
          </View>
      </View>

      <View style={styles.section}>
          <Text style={styles.sectionHeader}>Notes</Text>
          <TextInput
             style={styles.input}
             multiline
             value={noteText}
             onChangeText={setNoteText}
             onBlur={saveNotes}
             placeholder="Add notes here..."
          />
          <Text style={styles.hint}>Notes auto-save when you finish typing.</Text>
      </View>
      
      <View style={styles.section}>
          <Text style={styles.sectionHeader}>Attachments</Text>
          <View style={styles.attachmentRow}>
              {task.attachments.map((path, index) => (
                  <View key={index} style={styles.attachmentPlaceholder}>
                      <Text style={styles.attachmentText}>IMG {index + 1}</Text>
                  </View>
              ))}
              <TouchableOpacity style={styles.addPhotoBtn} onPress={() => navigation.navigate('Camera')}>
                  <Text style={styles.addPhotoText}>+ Add Photo</Text>
              </TouchableOpacity>
          </View>
      </View>
      
      {!task.isSynced && (
          <View style={styles.syncBanner}>
              <Text style={styles.syncText}>Changes are pending sync</Text>
          </View>
      )}
    </ScrollView>
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
    borderRadius: 8,
    padding: SPACING.m,
    marginBottom: SPACING.m,
  },
  title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: SPACING.m,
  },
  label: {
      fontSize: 14,
      color: COLORS.textSecondary,
      marginBottom: SPACING.xs,
  },
  value: {
      color: COLORS.text,
      fontWeight: '500',
  },
  sectionHeader: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: SPACING.m,
  },
  buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
  },
  statusBtn: {
      padding: SPACING.s,
      borderWidth: 1,
      borderColor: COLORS.primary,
      borderRadius: 4,
  },
  activeBtn: {
      backgroundColor: COLORS.primary,
  },
  btnText: {
      color: COLORS.black,
      fontSize: 12,
  },
  input: {
      borderWidth: 1,
      borderColor: COLORS.border,
      borderRadius: 8,
      padding: SPACING.s,
      minHeight: 100,
      textAlignVertical: 'top',
  },
  hint: {
      fontSize: 10,
      color: COLORS.textSecondary,
      marginTop: 4,
  },
  syncBanner: {
      padding: SPACING.m,
      backgroundColor: COLORS.warning,
      borderRadius: 8,
      alignItems: 'center',
      marginBottom: SPACING.xl,
  },
  syncText: {
      color: 'white',
      fontWeight: 'bold',
  },
  attachmentRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
  },
  attachmentPlaceholder: {
      width: 60,
      height: 60,
      backgroundColor: COLORS.border,
      marginRight: SPACING.s,
      marginBottom: SPACING.s,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 4,
  },
  attachmentText: {
      fontSize: 10,
  },
  addPhotoBtn: {
      width: 60,
      height: 60,
      borderWidth: 1,
      borderColor: COLORS.primary,
      borderStyle: 'dashed',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 4,
  },
  addPhotoText: {
      fontSize: 10,
      color: COLORS.primary,
      textAlign: 'center',
  }
});
