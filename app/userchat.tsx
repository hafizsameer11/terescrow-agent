import {
  Keyboard,
  StyleSheet,
  KeyboardAvoidingView,
  Modal,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ChatPfpNav from '@/components/ChatPfpNav';
import { COLORS, images } from '@/constants';
import { useTheme } from '@/contexts/themeContext';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Text } from 'react-native';
import { Image } from 'expo-image';
import { FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MessageInput from '@/components/MessageInput';
import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from 'expo-router';
import { DUMMY_ALL } from '@/utils/dummyAll';
import { DUMMY_CHAT } from '@/utils/dummyChat';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { NavigationOptions } from 'expo-router/build/global-state/routing';
import { NavigationProp } from '@react-navigation/native';
import { getTeamChatDetails } from '@/utils/queries/commonQueries';
import { useAuth } from '@/contexts/authContext';
import { useSocket } from '@/contexts/socketContext';
import { ChatType, IResMessage } from '@/utils/queries/agentQueries';
import {
  readAllMessages,
  sendMessageToTeam,
} from '@/utils/mutations/commonMutations';
import TeamMessageCom from '@/components/TeamMessageCom';
import LoadingOverlay from '@/components/LoadingOverlay';
import chat from './(tabs)/chat';
import { showTopToast } from '@/utils/helpers';
import { ApiError } from '@/utils/customApiCalls';

type Message = {
  id: string;
  text: string;
  isUser: boolean;
  image?: string;
};

const UserChat = () => {
  const { dark } = useTheme();
  const { id: currChatId }: { id: string } = useLocalSearchParams();
  const { goBack, reset, navigate } = useNavigation<NavigationProp<any>>();
  if (!currChatId) return;
  const { token, userData } = useAuth();
  const { socket } = useSocket();
  const currParticipantsIds = useRef<number[]>([]);
  const flatListRef = useRef<FlatList>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [messages, setMessages] = useState<IResMessage[]>([]);
  const queryClient = useQueryClient();
  const {
    data: chatDetailsData,
    isLoading: chatDetailsLoading,
    isError: isChatDetailsError,
    error: chatDetailsError,
  } = useQuery({
    queryKey: ['team-chat-details', currChatId],
    queryFn: () => getTeamChatDetails(token, currChatId),
  });

  const { mutate: sendMessage, isPending: sendingMessage } = useMutation({
    mutationKey: ['send-team-message'],
    mutationFn: (data: { message: string; chatId: number }) =>
      sendMessageToTeam(data, token),
    onSuccess: (data) => {
      if (data?.data) {
        setMessages((prevMessages) => [...prevMessages, data?.data]);
      }
    },
    onError: (error: ApiError) => {
      console.log(error);
      showTopToast({
        type: 'error',
        text1: 'Error',
        text2: error?.message || 'Failed to send message',
      });
    },
  });

  const { mutate: readAll, isPending: isReadAllPending } = useMutation({
    mutationKey: ['read-all-messages'],
    mutationFn: readAllMessages,
    onSuccess: (data) => {
      console.log('read chats');
      queryClient.invalidateQueries({ queryKey: ['all-chats-with-team'] });
      queryClient.refetchQueries({ queryKey: ['all-chats-with-team'] });
    },
    onError: (error: ApiError) => {
      console.log('reading failed', error);
      showTopToast({
        type: 'error',
        text1: 'Error',
        text2: error?.message || 'Failed to read messages',
      });
    },
  });

  const scrollToBottom = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  useFocusEffect(
    useCallback(() => {
      readAll({
        chatId: currChatId,
        token,
      });
      if (socket) {
        console.log('messge event called');
        socket.on(
          'message',
          ({ from, message }: { from: number; message: IResMessage }) => {
            // console.log(from, message);
            // console.log('My id: ', userData?.id);
            // console.log('participants: ', currParticipantsIds.current);
            if (
              from == userData?.id ||
              !currParticipantsIds.current.includes(from)
            )
              return;
            queryClient.invalidateQueries({
              queryKey: ['all-chats-with-team'],
            });
            setMessages((prevMessages) => [...prevMessages, message]);
            setTimeout(() => {
              scrollToBottom();
            }, 200);
          }
        );
      }
      // Do something when the screen is focused
      return () => {
        // Do something when the screen is unfocused
        console.log('message event off');
        socket?.off('message');
      };
    }, [])
  );

  // useEffect(() => {
  //   if (socket) {
  //     socket.on(
  //       'message',
  //       ({ from, message }: { from: number; message: IResMessage }) => {
  //         console.log(from, message);
  //         console.log('My id: ', userData?.id);
  //         console.log('participants: ', currParticipantsIds.current);
  //         if (
  //           from == userData?.id ||
  //           !currParticipantsIds.current.includes(from)
  //         )
  //           return;
  //         queryClient.invalidateQueries({ queryKey: ['all-chats-with-team'] });
  //         setMessages((prevMessages) => [...prevMessages, message]);
  //         setTimeout(() => {
  //           scrollToBottom();
  //         }, 200);
  //       }
  //     );
  //   }

  //   return () => {
  //     socket?.off('message');
  //   };
  // }, [socket]);

  useEffect(() => {
    if (chatDetailsData?.data) {
      if (chatDetailsData?.data?.participants.length > 0) {
        currParticipantsIds.current = [
          ...chatDetailsData?.data.participants,
        ].map((participant) => participant?.user.id);
      }
      setMessages(chatDetailsData?.data.messages);
    }
  }, [chatDetailsData]);

  const handleSendMessage = (message?: string, image?: any) => {
    if (!image && !message) return;

    console.log(message);

    if (message) {
      sendMessage({
        message,
        chatId: Number(currChatId),
      });
    }
  };

  // console.log(chatDetailsData?.data);

  //this event listener scrolls to bottom to view full content
  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', () => {
      // console.log('ok');
      setTimeout(() => scrollToBottom(), 200);
    });

    return () => {
      Keyboard.removeAllListeners;
    };
  }, []);

  const renderAgentChat = () => {
    return (
      <KeyboardAvoidingView
        style={[
          styles.container,
          dark
            ? { backgroundColor: COLORS.black }
            : { backgroundColor: COLORS.white },
        ]}
        behavior="padding"
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TeamMessageCom
              messageData={item}
              participants={chatDetailsData?.data.participants!}
            />
          )}
          contentContainerStyle={styles.chatContainer}
          onContentSizeChange={scrollToBottom}
        />

        <MessageInput
          sendMessage={handleSendMessage}
          sendingMessage={sendingMessage}
        />

        {imagePreview && (
          <Modal transparent={true} visible={!!imagePreview}>
            <View style={styles.previewContainer}>
              <Image
                source={{ uri: imagePreview }}
                style={styles.previewImage}
              />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setImagePreview(null)}
              >
                <Ionicons name="arrow-back" size={40} color="black" />
              </TouchableOpacity>
            </View>
          </Modal>
        )}
      </KeyboardAvoidingView>
    );
  };

  return (
    <SafeAreaView
      style={[
        { flex: 1 },
        dark
          ? { backgroundColor: COLORS.black }
          : { backgroundColor: COLORS.white },
      ]}
    >
      <LoadingOverlay visible={chatDetailsLoading} />
      <ChatPfpNav chatDetails={chatDetailsData?.data} />
      {renderAgentChat()}
    </SafeAreaView>
  );
};

export default UserChat;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  chatContainer: { padding: 10 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingStart: 20,
    paddingEnd: 60,
    borderRadius: 25,
    marginHorizontal: 10,
    fontSize: 16,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: COLORS.grayscale400,
  },
  iconButton: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 50,
    borderColor: COLORS.grayscale400,
  },
  sendMessage: {
    position: 'absolute',
    right: 20,
    paddingVertical: 10,
    paddingRight: 20,
  },
  imagePickerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  optionButton: {
    backgroundColor: COLORS.white,
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  previewContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  previewImage: { width: '100%', height: '100%', resizeMode: 'contain' },
  closeButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: COLORS.white,
    borderRadius: 50,
    padding: 5,
  },
  groupMessage: {
    borderColor: COLORS.primary,
    borderWidth: 1,
    padding: 10,
  },
});
