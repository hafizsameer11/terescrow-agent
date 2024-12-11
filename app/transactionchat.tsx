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
import { getChatDetails, IResMessage } from '@/utils/queries/agentQueries';
import MessageCom from '@/components/chat/MessageCom';
import { sendMessageToCustomer } from '@/utils/mutations/agentMutations';
import { ApiError } from '@/utils/customApiCalls';
import { showTopToast } from '@/utils/helpers';
import { useSocket } from '@/contexts/socketContext';
import chat from './(tabs)/chat';

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
  // const userData = DUMMY_CHAT.filter((item) => item.id === chatId);
  const flatListRef = useRef<FlatList>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAccepted, setIsAccepted] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [modalVisibility, setmodalVisibility] = useState(false);
  const [isRejected, setIsrejected] = useState(false);
  const [isShowNotes, setIsShowNotes] = useState(false);
  const [selectServices, setSelectServices] = useState(false);
  const [messages, setMessages] = useState<IRenderMessage[]>([]);

  const { token, userData } = useAuth();
  const { socket } = useSocket();
  const {
    data: chatDetailsData,
    isLoading: chatDetailsLoading,
    isError: isChatDetailsError,
    error: chatDetailsError,
  } = useQuery({
    queryKey: ['chat-details', chatId],
    queryFn: () => getChatDetails(chatId, token),
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
          console.log(from, message);
          console.log('hgf');
          console.log(userData?.id);
          console.log(chatDetailsData?.data.customer.id);
          if (from == userData?.id || from == chatDetailsData?.data.customer.id)
            return;
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

  const onAcceptHandler = () => {
    setIsAccepted(true);
  };

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const onProcessHandler = () => {
    setIsProcessed(true);
    openModal();
  };

  const onProcessCancelHandler = () => {
    setIsProcessed(false);
    setmodalVisibility(false);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const openModal = () => {
    if (!modalVisibility) {
      timeoutRef.current = setTimeout(() => {
        setmodalVisibility(true);
        timeoutRef.current = null;
      }, 2000);
    }
  };

  const closeModal = () => {
    setmodalVisibility(false);
    setIsProcessed(false);
  };

  const handleConfirm = () => {
    console.log('Transaction Confirmed!');
    closeModal();
    setIsProcessed(false);
    servicesShowHandler();
    setIsConfirmed(true);
  };

  const onDeclineHandler = () => {
    setIsrejected(true);
    setIsAccepted(false);
  };

  const scrollToBottom = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  const servicesShowHandler = () => {
    console.log('services');
    setTimeout(() => {
      setSelectServices(true);
    }, 3000);
  };

  const showNotesHandler = () => {
    setIsShowNotes(true);
  };

  const closeNotesHandler = () => {
    setIsShowNotes(false);
  };

  const sendMessage = (message?: string, image?: any) => {
    if (!image && !message) return;

    let newMessage: IRenderMessage;
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

  messages.map((item) => console.log(item.text));
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
        {isAccepted && !isConfirmed && (
          <MessageInput
            sendMessage={sendMessage}
            sendingMessage={messsageSending}
          />
        )}

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

  return (
    <SafeAreaView
      style={[
        { flex: 1 },
        dark
          ? { backgroundColor: COLORS.black }
          : { backgroundColor: COLORS.white },
      ]}
    >
      {chatDetailsData &&
        (() => {
          const { firstname, lastname, id, username, profilePicture } =
            chatDetailsData.data.customer;
          return (
            <TransChatNav
              name={firstname + ' ' + lastname}
              userName={username}
              image={profilePicture || images.avatar}
              onAccept={onAcceptHandler}
              currentState={isAccepted}
              onProcess={onProcessHandler}
              isCurrentlyConfirmed={isConfirmed}
              onDecline={onDeclineHandler}
              isDeclined={isRejected}
              showNotes={showNotesHandler}
            />
          );
        })()}
      {/* if user accepted */}
      {!isAccepted && !isRejected && (
        <RenderMsg text="Click on the tick icon above to accept the order" />
      )}
      {!isAccepted && isRejected && <RenderMsg text="Declined the trade" />}
      {isAccepted && <RenderMsg text="Accepted by - You" />}
      {/* if user have started processing */}
      {isProcessed && (
        <RenderMsgUserDecision
          text="This trade is currently being proceed you"
          icon={icons.hourGlass}
          bgColor="#FEFFD7"
          isProcess={true}
          OnCancel={onProcessCancelHandler}
        />
      )}
      {/* Modal of confirmation */}
      <ConfirmationModal
        isDarkMode={dark}
        onCLose={closeModal}
        OnConfirm={handleConfirm}
        modalState={modalVisibility}
      />
      {isConfirmed && (
        <RenderMsgUserDecision
          text="This trade is completed by you"
          icon={icons.check2}
          bgColor="#EBFFF3"
          isProcess={false}
          OnCancel={() => null}
        />
      )}
      {isRejected && (
        <RenderMsgUserDecision
          text="This trade is declined by you"
          icon={icons.close2}
          bgColor="#FFD7D7"
          isProcess={false}
          OnCancel={() => null}
        />
      )}
      <SelectService showServices={selectServices} />
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
