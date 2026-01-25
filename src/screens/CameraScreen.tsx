import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const CameraScreen = () => {
    return (
        <View style={styles.container}>
            <Text>Camera functionality to be implemented with react-native-vision-camera</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
