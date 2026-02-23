import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
} from 'react-native';

import { useRoute } from '@react-navigation/native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import Realm from 'realm';

import { useRealm, useObject } from '../database/realm';
import { Task } from '../database/schemas';
import { COLORS, SPACING } from '../theme/theme';
import { goBack } from '../utils/NavigationUtil';
import Toast from '../utils/Toast';

export const CameraScreen = () => {
  const route = useRoute<any>();
  const { taskId } = route.params || {};
  const [capturing, setCapturing] = useState(false);
  const camera = useRef<Camera>(null);

  const realm = useRealm();
  const task = useObject(Task, taskId);

  // Real Camera logic
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No camera permission</Text>
        <TouchableOpacity
          onPress={() => Linking.openSettings()}
          style={styles.backBtn}
        >
          <Text style={styles.backBtnText}>Open Settings</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No camera device found</Text>
        <TouchableOpacity onPress={() => goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!task) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Task not found</Text>
        <TouchableOpacity onPress={() => goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (camera.current == null) return;

    try {
      setCapturing(true);
      const photo = await camera.current.takePhoto({
        flash: 'auto',
      });

      const photoPath = `file://${photo.path}`;

      realm.write(() => {
        task.attachments.push(photoPath);
        task.updatedAt = new Date();
        task.isSynced = false;

        const payload = {
          _id: task._id,
          attachment: photoPath,
          operation: 'ADD_ATTACHMENT',
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

      goBack();
    } catch (e) {
      console.error(e);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to take photo',
      });
    } finally {
      setCapturing(false);
    }
  };

  return (
    <View style={styles.container}>
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={true}
      />

      <View style={styles.overlay}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => goBack()} style={styles.closeBtn}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.viewfinder}>
          <Text style={styles.instruction}>Align subject within frame</Text>
          <View style={styles.focusFrame} />
        </View>

        <View style={styles.controls}>
          {capturing ? (
            <ActivityIndicator size="large" color={COLORS.white} />
          ) : (
            <TouchableOpacity
              style={styles.captureBtnOuter}
              onPress={takePicture}
            >
              <View style={styles.captureBtnInner} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: SPACING.m,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  closeBtn: {
    padding: SPACING.s,
  },
  closeText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  viewfinder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instruction: {
    color: 'white',
    marginBottom: SPACING.l,
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontSize: 12,
  },
  focusFrame: {
    width: 300,
    height: 400,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    borderStyle: 'dashed',
  },
  controls: {
    height: 120,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  captureBtnOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: 'white',
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureBtnInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  errorText: {
    color: 'white',
    fontSize: 20,
  },
  backBtn: {
    marginTop: 20,
    padding: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  backBtnText: {
    color: 'white',
  },
});
