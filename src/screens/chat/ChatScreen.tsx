import React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { navigate } from '../../utils/NavigationUtil';
import { User } from './types';

export const ChatScreen = () => {
    const users: User[] = [
        {
            id: 1,
            profilePic: "https://images.unsplash.com/photo-1519764622345-23439dd774f7?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            name: "Paras Naulia",
            lastMessage: "Kya haal hai bhai",
            time: "3hr ago",
            unreadCount: 3,
        },
        {
            id: 2,
            profilePic: "https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            name: "Vaibhav",
            lastMessage: "Kachori khane chaley??`",
            time: "5hr ago",
            unreadCount: 2,
        }
    ]

    const onClickUser = (user: User) => {
        navigate('ChatSpecific', {user})
    }

    const renderItem = ({ item, index }: { item: User, index: number }) => (
        <TouchableOpacity style={styles.userCard} onPress={() => onClickUser(item)}>
            <View>
                <Image source={{ uri: item?.profilePic }} style={styles.userImage} />
            </View>
            <View style={styles.userInfo}>
                <View style={styles.userHeader}>
                    <Text style={styles.userName}>{item?.name}</Text>
                    <Text style={styles.userTime}>{item?.time}</Text>
                </View>
                <Text style={styles.userMessage}>{item?.lastMessage}</Text>
            </View>
        </TouchableOpacity>
    )
    return (
        <View style={styles.container}>
            <FlatList
                data={users}
                keyExtractor={(item) => item?.id?.toString()}
                renderItem={renderItem}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },
    userCard: {
        flexDirection: "row",
        padding: 12,
        borderBottomWidth: 0.5,
        borderColor: "#e5e5e5",
        backgroundColor: "#fff"
    },
    userImage: {
        width: 50,
        height: 50,
        borderRadius: 25
    },
    userInfo: {
        marginLeft: 12,
        flex: 1,
        padding: 4,
        gap: 2
    },
    userName: {
        fontSize: 16,
        fontWeight: "bold"
    },
    userTime: {
        fontSize: 12,
        color: "gray"
    },
    userMessage: {
        fontSize: 14,
        color: "gray"
    },
    userHeader: {
        flexDirection: "row",
        justifyContent: "space-between"
    }
})
