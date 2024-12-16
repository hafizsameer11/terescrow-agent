import {
  Keyboard,
  StyleSheet,
  KeyboardAvoidingView,
  Modal,
  TouchableOpacity,
  View,
  FlatList,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, icons, images } from '@/constants';
import { useTheme } from '@/contexts/themeContext';
import { useEffect, useRef, useState } from 'react';
import { Text } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import MessageInput from '@/components/MessageInput';
import { DUMMY_CHAT } from '@/utils/dummyChat';
import { useLocalSearchParams } from 'expo-router';
import TransChatNav from '@/components/TransChatNav';
import SelectService from '@/components/Transaction Chat/SelectService';
import ChatNotes from '@/components/Transaction Chat/ChatNotes';
import RenderMsgUserDecision from '@/components/Transaction Chat/RenderMsgUserDecision';
import ConfirmationModal from '@/components/Transaction Chat/ConfirmationModal';
import RenderMsg from '@/components/Transaction Chat/RenderMsg';
import { useAuth } from '@/contexts/authContext';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  ChatStatus,
  getCustomerChatDetails,
  IResMessage,
} from '@/utils/queries/agentQueries';
import MessageCom from '@/components/chat/MessageCom';
import {
  changeChatStatus,
  sendMessageToCustomer,
} from '@/utils/mutations/agentMutations';
import { ApiError, ApiResponse } from '@/utils/customApiCalls';
import { showTopToast } from '@/utils/helpers';
import { useSocket } from '@/contexts/socketContext';
import chat from './(tabs)/chat';
import LoadingOverlay from '@/components/LoadingOverlay';

export type IRenderMessage = {
  id: string;
  text: string;
  isUser: boolean;
  image?: string;
  timestampt: Date;
};

const TransactionChat = () => {
  const { dark } = useTheme();
  const { id: chatId } = useLocalSearchParams() as { id: string };
  const flatListRef = useRef<FlatList>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [modalVisibility, setmodalVisibility] = useState(false);
  const [isShowNotes, setIsShowNotes] = useState(false);
  const [messages, setMessages] = useState<IRenderMessage[]>([]);
  const currCustomerId = useRef<number | null>(null);

  const { token, userData } = useAuth();
  const { socket } = useSocket();
  const {
    data: chatDetailsData,
    isLoading: chatDetailsLoading,
    isError: isChatDetailsError,
    error: chatDetailsError,
  } = useQuery({
    queryKey: ['customer-chat-details'],
    queryFn: () => getCustomerChatDetails(chatId, token),
  });
  const { mutate: changeStatus, isPending: changeStatusPending } = useMutation({
    mutationFn: (data: { chatId: string; setStatus: ChatStatus }) =>
      changeChatStatus(data, token),
    mutationKey: ['change-chat-status'],
    onSuccess: (data: ApiResponse) => {
      showTopToast({
        type: 'success',
        text1: 'Success',
        text2: data?.message || 'Status changed successfully',
      });
    },
    onError: (error: ApiError) => {
      showTopToast({
        type: 'error',
        text1: 'Error',
        text2: error.message,
      });
    },
  });

  const { mutate: postMessage, isPending: messsageSending } = useMutation({
    mutationFn: (data: { chatId: string; message: string }) =>
      sendMessageToCustomer(data, token),
    mutationKey: ['send-message-to-customer'],
    onSuccess: (data) => {
      const newMessage = {
        id: data.data.id.toString(),
        text: data.data.message,
        isUser: true,
        timestampt: new Date(data.data.createdAt),
      };
      setMessages((prev) => [...prev, newMessage]);
      setTimeout(() => {
        scrollToBottom();
      }, 400);
    },
    onError: (error: ApiError) => {
      showTopToast({
        type: 'error',
        text1: 'Error',
        text2: error.message,
      });
    },
  });
  useEffect(() => {
    if (chatDetailsData?.data.messages) {
      currCustomerId.current = chatDetailsData?.data.customer.id;
      setMessages((prev) => {
        const newMesssages = chatDetailsData?.data.messages.map((item) => ({
          id: item.id.toString(),
          text: item.message,
          isUser: userData?.id ? item.senderId === userData?.id : false,
          timestampt: new Date(item.createdAt),
        }));
        return [...prev, ...newMesssages];
      });
    }

    return () => {
      setMessages([]);
    };
  }, [chatDetailsData]);
  useEffect(() => {
    if (socket) {
      socket.on(
        'message',
        ({ from, message }: { from: number; message: IResMessage }) => {

          console.log('agentId', userData?.id);
          console.log('customerId', currCustomerId?.current);
          if (from == userData?.id || from !== currCustomerId?.current) return;
          setMessages((prev) => {
            const newMessage = {
              id: message.id.toString(),
              text: message.message,
              isUser: false,
              timestampt: new Date(message.createdAt),
            };
            return [...prev, newMessage];
          });

          setTimeout(() => {
            scrollToBottom();
          }, 400);
        }
      );
    }

    return () => {
      if (socket) {
        socket?.off('message');
      }
    };
  }, [socket]);
useEffect(() => {
  if(chatDetailsData){
    console.log("chatcategoryu", chatDetailsData.data.chatDetails);
  }
})
  const handleChangeStatus = (status: ChatStatus) => {
    if (changeStatusPending) return;
    if (status == ChatStatus.declined) {
      changeStatus({ chatId, setStatus: status });
    }
    if (status == ChatStatus.successful) {
      if (!modalVisibility) {
        setmodalVisibility(true);
      }
    }
  };

  const scrollToBottom = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  const showNotesHandler = () => {
    setIsShowNotes(true);
  };

  const closeNotesHandler = () => {
    setIsShowNotes(false);
  };

  const sendMessage = (message?: string, image?: any) => {
    if (!message) return;

    if (message) {
      postMessage({
        chatId,
        message,
      });
    }
  };

  //this event listener scrolls to bottom to view full content
  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', () => {
      console.log('ok');
      setTimeout(() => scrollToBottom(), 200);
    });

    return () => {
      Keyboard.removeAllListeners;
    };
  }, []);

  // console.log(ChatStatus.successful);
  // messages.map((item) => console.log(item.text));
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
          keyExtractor={(item) => Math.random().toString()}
          renderItem={({ item }) => (
            <MessageCom messageData={item} setImagePreview={setImagePreview} />
          )}
          contentContainerStyle={styles.chatContainer}
          onContentSizeChange={scrollToBottom}
        />
        {/* {isAccepted && !isConfirmed && ( */}
        {chatDetailsData?.data.chatDetails.status == ChatStatus.pending && (
          <MessageInput
            sendMessage={sendMessage}
            sendingMessage={messsageSending}
          />
        )}
        {/* // )} */}

        {imagePreview && (
          <Modal transparent={true} visible={!!imagePreview}>
            <View style={styles.previewContainer}>
              <Image source={imagePreview} style={styles.previewImage} />
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

  console.log(chatDetailsData?.data.chatDetails.status);

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

      {chatDetailsData?.data &&
        (() => {
          const { firstname, lastname, id, username, profilePicture } =
            chatDetailsData.data.customer;
          // console.log(profilePicture);
          return (
            <TransChatNav
              name={firstname + ' ' + lastname}
              userName={username}
              image={profilePicture || images.avatar}
              changeChatStatus={handleChangeStatus}
              showNotes={showNotesHandler}
              currentState={chatDetailsData.data.chatDetails.status}
            />
          );
        })()}

      <ConfirmationModal
        setModalState={setmodalVisibility}
        modalState={modalVisibility}
        currChatId={chatDetailsData?.data?.id}
        currCategory={chatDetailsData?.data?.chatDetails?.category}
        currDepartment={chatDetailsData?.data?.chatDetails?.department}
      />

      {chatDetailsData?.data?.chatDetails?.status &&
        (chatDetailsData.data.chatDetails.status === ChatStatus.declined ||
        chatDetailsData.data.chatDetails.status === ChatStatus.successful ? (
          <RenderMsgUserDecision
            text={`This trade is ${
              chatDetailsData.data.chatDetails.status === ChatStatus.successful
                ? 'completed'
                : 'declined'
            } by you`}
            icon={icons.close2}
            bgColor={
              chatDetailsData.data.chatDetails.status === ChatStatus.declined
                ? '#FFD7D7'
                : '#EBFFF3'
            }
            isProcess={false}
            OnCancel={() => null}
          />
        ) : null)}

      {/* <SelectService showServices={selectServices} /> */}
      {isShowNotes && (
        <ChatNotes closeNotes={closeNotesHandler} showNotesSate={isShowNotes} />
      )}
      {renderAgentChat()}
    </SafeAreaView>
  );
};

export default TransactionChat;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  chatContainer: { padding: 10 },
  dynamicImage: { width: '100%', height: undefined, aspectRatio: 1 },
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
  userInfo: {
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.grayscale200,
  },
  processContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 120,
    zIndex: 1,
  },
  processing: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 11,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginHorizontal: '2%',
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    width: '93%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  header: {
    width: '100%',
    alignItems: 'flex-end',
  },
  body: {
    marginTop: 20,
    alignItems: 'center',
  },
  icon: {
    fontSize: 40,
    color: COLORS.white,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  message: {
    fontSize: 14,
    color: COLORS.greyscale600,
    textAlign: 'center',
  },
  footer: {
    width: '100%',
    marginTop: 20,
  },
  checkIconContainer: {
    backgroundColor: COLORS.black,
    marginRight: 12,
    padding: 5,
    borderRadius: 10,
  },
  closeModalButtom: {
    backgroundColor: COLORS.black,
    padding: 5,
    borderRadius: 50,
  },
});
