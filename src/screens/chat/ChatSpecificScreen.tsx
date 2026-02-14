import React, { useEffect, useState } from 'react';
import { Image, Platform, Text, TouchableOpacity, View } from 'react-native';
import { GiftedChat, IMessage, Send } from 'react-native-gifted-chat';
import SendSVG from '../../assets/svg/Send';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { goBack } from '../../utils/NavigationUtil';

export const ChatSpecificScreen = ({ route }: any) => {
  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'John Doe',
        },
      },
    ]);
  }, []);

  const onSend = (newMessages: IMessage[] = []) => {
    setMessages((previousMessages: IMessage[]) =>
      GiftedChat.append(previousMessages, newMessages),
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 12,
            gap: 12,
            borderBottomWidth: 0.5,
            borderColor: '#e5e5e5',
          }}
        >
          <TouchableOpacity style={{ padding: 4 }} onPress={() => goBack()}>
            {/* <BackSVG width={24} height={24} fill="#000" /> */}
            <Ionicons name="chevron-back" size={24} color={'#000'} />
          </TouchableOpacity>
          <Image
            source={{ uri: route?.params?.user?.profilePic }}
            style={{ width: 42, height: 42, borderRadius: 25 }}
          />
          <View>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
              {route?.params?.user?.name}
            </Text>
            <Text style={{ fontSize: 12, color: 'gray' }}>Online</Text>
          </View>
        </View>
        <GiftedChat
          messages={messages}
          onSend={newMessages => onSend(newMessages)}
          user={{
            _id: 1,
          }}
          isSendButtonAlwaysVisible={true}
          keyboardAvoidingViewProps={{
            behavior: Platform.OS === 'ios' ? 'padding' : 'height',
            keyboardVerticalOffset: Platform.OS === 'ios' ? 140 : 120,
          }}
          colorScheme="light"
          renderSend={props => (
            <Send
              {...props}
              containerStyle={{
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <TouchableOpacity
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 20,
                  backgroundColor: '#58a4f6ff',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 12,
                }}
                activeOpacity={0.8}
              >
                <SendSVG width={20} height={20} fill="#fff" />
              </TouchableOpacity>
            </Send>
          )}
          reply={{
            swipe: {
              isEnabled: true,
              direction: 'right',
            },
          }}
        />
      </View>
    </SafeAreaView>
  );
};
