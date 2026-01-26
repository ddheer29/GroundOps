import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useRealm, useObject } from '../database/realm';
import { Task } from '../database/schemas';
import { COLORS, SPACING } from '../theme/theme';
import Realm from 'realm';

export const CameraScreen = () => {
    const route = useRoute<any>();
    const navigation = useNavigation();
    const { taskId } = route.params || {};
    const [capturing, setCapturing] = useState(false);
    
    const realm = useRealm();
    const task = useObject(Task, taskId);

    if (!task) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Task not found</Text>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Text style={styles.backBtnText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const takePicture = async () => {
        setCapturing(true);
        
        // Simulate camera processing delay
        setTimeout(() => {
            const mockPath = `file:///storage/emulated/0/GroundOps/IMG_${Date.now()}.jpg`;
            
            realm.write(() => {
                // 1. Add attachment to task
                task.attachments.push(mockPath);
                task.updatedAt = new Date();
                task.isSynced = false;

                // 2. Add to SyncQueue
                const payload = {
                    _id: task._id,
                    attachment: mockPath,
                    operation: 'ADD_ATTACHMENT'
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

            setCapturing(false);
            navigation.goBack();
        }, 1500);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
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
                    <TouchableOpacity style={styles.captureBtnOuter} onPress={takePicture}>
                        <View style={styles.captureBtnInner} />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
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
    }
});
