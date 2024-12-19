import { useCallback, useEffect, useRef, useState } from 'react';
import { View, FlatList, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/themeContext';
import { Colors } from '@/constants/Colors';
import TeamChatHeader from '@/components/TeamChatHeader';
import TeamChatSearch from '@/components/TeamChatSearch';
import TeamChatCategorys from '@/components/TeamChatCategorys';
import { DUMMY_ALL } from '@/utils/dummyAll';
import TeamChatContactList from '@/components/TeamChatContactList';
import TeamGroupModal from '@/components/TeamGroupModal';
import { useSocket } from '@/contexts/socketContext';
import { useAuth } from '@/contexts/authContext';
import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ChatType,
  getCustomerChatDetails,
  IResMessage,
} from '@/utils/queries/agentQueries';
import {
  getAllTeamChats,
  ITeamChatResponse,
} from '@/utils/queries/commonQueries';
import { icons, images } from '@/constants';
import { sortChatsByLatestMessage } from '@/utils/helpers';
import LoadingOverlay from '@/components/LoadingOverlay';
import { Text } from 'react-native';
import { useFocusEffect } from 'expo-router';

const TeamCommunication = () => {
  const { dark } = useTheme();
  const { token, userData } = useAuth();
  const { socket } = useSocket();
  const queryClient = useQueryClient();
  const currChatIds = useRef<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [displayChats, setDisplayChats] = useState<ITeamChatResponse['data']>(
    []
  );
  const [modalVisibility, setModalVisibility] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const {
    data: allChatsData,
    isLoading: allChatsLoading,
    isError: isAllChatsError,
    error: allChatsError,
  } = useQuery({
    queryKey: ['all-chats-with-team'],
    queryFn: () => getAllTeamChats(token),
  });

  // console.log('hi');
  const selectCategoryHandler = (selected: string) => {
    console.log(selected);
    setSelectedCategory(selected);
  };

  const modalVisibilityHandler = (modalState: boolean) => {
    setModalVisibility(modalState);
  };

  const filteredChatsWithCategory = useCallback(
    (chatsData: ITeamChatResponse['data']) => {
      switch (selectedCategory) {
        case 'All':
          return sortChatsByLatestMessage(chatsData);

        case 'Group':
          const groupChats = [...chatsData].filter(
            (chat) => chat.chatType === ChatType.group_chat
          );
          return sortChatsByLatestMessage(groupChats);

        case 'Unread':
          const unreadChats = [...chatsData].filter((chat) => {
            if (!chat.messages || chat.messages.length === 0) return false;
            return !chat.messages[0].isRead;
          });
          return sortChatsByLatestMessage(unreadChats);

        default:
          return sortChatsByLatestMessage(chatsData); // Handle cases where no category matches
      }
    },
    [selectedCategory] // Dependency array
  );

  const filterBySearchTerm = useCallback(
    (chats: ITeamChatResponse['data']) => {
      if (!searchTerm.trim()) return chats;
      const filteredChats = [...chats].filter((chat) => {
        if (chat.chatType === ChatType.group_chat)
          return chat.chatGroup?.groupName
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const { firstname, lastname } = chat.participants[0].user;
        return (firstname + ' ' + lastname)
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      });

      return filteredChats;
    },
    [searchTerm] // Dependency array
  );

  useEffect(() => {
    if (allChatsData?.data) {
      currChatIds.current = [...allChatsData?.data].map((chat) => chat.id);
      const filteredChats = applyFilters(allChatsData?.data);
      setDisplayChats(filteredChats);
    }
  }, [allChatsData, searchTerm, selectedCategory]);

  //refetch query when a new message comes or when the component gains focus
  useFocusEffect(
    useCallback(() => {
      queryClient.refetchQueries({ queryKey: ['all-chats-with-team'] });
      if (socket) {
        socket.on(
          'message',
          ({ from, message }: { from: number; message: IResMessage }) => {
            if (currChatIds.current.includes(message.chatId)) {
              queryClient.refetchQueries({
                queryKey: ['all-chats-with-team'],
              });
            }
          }
        );
      }

      return () => {
        if (socket) {
          socket?.off('message');
        }
      };
    }, [])
  );

  const applyFilters = (chats: ITeamChatResponse['data']) => {
    return filterBySearchTerm(filteredChatsWithCategory(chats)!);
  };

  const handleSearchChange = (searchTerm: string) => {
    setSearchTerm(searchTerm); // Update the search term state
  };

  // console.log(allChatsData?.data);

  return (
    <View
      style={[
        styles.container,
        dark
          ? { backgroundColor: Colors.dark.background }
          : { backgroundColor: Colors.light.background },
      ]}
    >
      <LoadingOverlay visible={allChatsLoading} />
      {isAllChatsError && (
        <View style={{ alignItems: 'center' }}>
          <Text style={{ color: 'red' }}>{allChatsError?.message}</Text>
        </View>
      )}
      {/* Header */}
      <TeamChatHeader setModalVisible={modalVisibilityHandler} />
      {/* Search bar */}
      <ScrollView style={{ paddingHorizontal: 15 }}>
        <TeamChatSearch isDarkMode={dark} onSearchChange={handleSearchChange} />
        {/* Category */}
        <TeamChatCategorys
          onSelectHandler={selectCategoryHandler}
          selectedCategory={selectedCategory}
          isDarkMode={dark}
        />
        {/* Chat list */}
        <FlatList
          data={displayChats}
          style={styles.chatList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            let profilePicture;
            let profileName;
            let recentDate;
            let recentMessage;

            if (item.chatGroup) {
              profileName = item.chatGroup.groupName;
              profilePicture = item.chatGroup?.groupProfile;
            } else {
              const receiver = item.participants.filter(
                (participant) => participant.user.id !== userData?.id
              )[0]?.user;
              profileName = receiver?.firstname + ' ' + receiver?.lastname;
              profilePicture = receiver?.profilePicture;
            }

            if (item.messages.length > 0) {
              recentDate = item.messages[0].createdAt;
              recentMessage = item.messages[0].message;
            }

            return (
              <TeamChatContactList
                id={item.id.toString()}
                pfp={
                  profilePicture
                    ? profilePicture
                    : item.chatType == ChatType.group_chat
                    ? icons.people
                    : icons.profile
                }
                name={profileName}
                date={recentDate}
                recentMsg={recentMessage || 'No recent message'}
                msgCount={item._count?.messages}
                isDarkMode={dark}
              />
            );
          }}
          scrollEnabled={false}
        />
        {/* Modal */}
        <TeamGroupModal
          isDarkMode={dark}
          modalVisible={modalVisibility}
          setModalVisible={modalVisibilityHandler}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatList: {
    marginTop: 20,
  },
});

export default TeamCommunication;