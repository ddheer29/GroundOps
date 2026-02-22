import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useQuery } from '../database/realm';
import { User } from '../database/schemas';
import { COLORS, SPACING, FONT_SIZE } from '../theme/theme';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export const ProfileScreen = () => {
    const users = useQuery(User);
    const user = users[0];
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    if (!user) {
        return (
            <View style={styles.container}>
                <Text>No user session found</Text>
            </View>
        );
    }

    const ProfileItem = ({ icon, label, value }: { icon: string, label: string, value?: string }) => (
        <View style={styles.itemContainer}>
            <MaterialDesignIcons name={icon as any} size={24} color={COLORS.primary} style={styles.icon} />
            <View>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.value}>{value || 'Not provided'}</Text>
            </View>
        </View>
    );

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    {user.profilePhoto ? (
                        <Image source={{ uri: user.profilePhoto }} style={styles.avatar} />
                    ) : (
                        <Image source={{ uri: "https://images.unsplash.com/vector-1742875355318-00d715aec3e8?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }} style={styles.avatar} />
                    )}
                </View>
                <Text style={styles.name}>{user.name || user.username}</Text>
            </View>

            <View style={styles.section}>
                <ProfileItem icon="account" label="Name" value={user.name} />
                <ProfileItem icon="account" label="Username" value={user.username} />
                <ProfileItem icon="calendar" label="Date of Birth" value={user.dob} />
            </View>

            <TouchableOpacity 
                style={styles.editButton}
                onPress={() => navigation.navigate('EditProfile', { user: JSON.parse(JSON.stringify(user)) })}
            >
                <MaterialDesignIcons name="pencil" size={20} color={COLORS.white} />
                <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        backgroundColor: COLORS.card,
        padding: SPACING.xl,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    avatarContainer: {
        marginBottom: SPACING.m,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: COLORS.primary,
    },
    name: {
        fontSize: FONT_SIZE.xl,
        fontWeight: '700',
        color: COLORS.text,
    },
    role: {
        fontSize: FONT_SIZE.m,
        color: COLORS.textSecondary,
        marginTop: SPACING.xs,
    },
    section: {
        backgroundColor: COLORS.card,
        marginTop: SPACING.m,
        paddingHorizontal: SPACING.l,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderTopColor: COLORS.border,
        borderBottomColor: COLORS.border,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.m,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    icon: {
        marginRight: SPACING.m,
    },
    label: {
        fontSize: FONT_SIZE.s,
        color: COLORS.textSecondary,
    },
    value: {
        fontSize: FONT_SIZE.m,
        color: COLORS.text,
        marginTop: 2,
    },
    editButton: {
        flexDirection: 'row',
        backgroundColor: COLORS.primary,
        margin: SPACING.l,
        padding: SPACING.m,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    editButtonText: {
        color: COLORS.white,
        fontSize: FONT_SIZE.m,
        fontWeight: '600',
        marginLeft: SPACING.s,
    },
});