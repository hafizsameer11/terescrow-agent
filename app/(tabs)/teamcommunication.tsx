import { useState } from 'react';
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
import { QueryClient, useQuery } from '@tanstack/react-query';
import { getChatDetails } from '@/utils/queries/agentQueries';
import { getAllTeamChats } from '@/utils/queries/commonQueries';
import { images } from '@/constants';

interface User {
  id: string;
}

interface selectedPeopleGroup {
  id: string;
  name: string;
  pfp: string;
}

const TeamCommunication = () => {
  const { dark } = useTheme();
  const { token, userData } = useAuth();
  const { socket } = useSocket();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [modalVisibility, setModalVisibility] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<selectedPeopleGroup[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const {
    data: allChatsData,
    isLoading: allChatsLoading,
    isError: isAllChatsError,
    error: allChatsError,
  } = useQuery({
    queryKey: ['all-chats-with-customer'],
    queryFn: () => getAllTeamChats(token),
  });

  const queryClient = new QueryClient();

  const selectCategoryHandler = (selected: string) => {
    setSelectedCategory(selected);
  };

  const modalVisibilityHandler = (modalState: boolean) => {
    setModalVisibility(modalState);
  };

  const filterDataHandler = (selectedItem: string) => {
    let filteredData = DUMMY_ALL;
    // Filter by category
    if (selectedItem === 'Group') {
      filteredData = filteredData.filter((item) => item.group);
    } else if (selectedItem === 'Unread') {
      filteredData = filteredData.filter((item) => !item.seen);
    }

    // Filter by search term
    if (searchTerm) {
      filteredData = filteredData.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filteredData;
  };

  const handleSearchChange = (searchTerm: string) => {
    setSearchTerm(searchTerm); // Update the search term state
  };

  const handleSelectedUsers = (users: User[]) => {
    const selectedUserIds = users.map((user) => user.id);
    const filteredUsers = DUMMY_ALL.filter((user) =>
      selectedUserIds.includes(user.id)
    );
    setSelectedUsers(filteredUsers);
  };
  console.log(selectedUsers);

  return (
    <View
      style={[
        styles.container,
        dark
          ? { backgroundColor: Colors.dark.background }
          : { backgroundColor: Colors.light.background },
      ]}
    >
      {/* Header */}
      <TeamChatHeader
        isDarkMode={dark}
        setModalVisible={modalVisibilityHandler}
      />
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
          data={allChatsData?.data}
          style={styles.chatList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            let profilePicture;
            let profileName;
            let recentDate;
            let recentMessage;

            if (item.chatGroup) {
              profileName = item.chatGroup.groupName;
              profilePicture = item.chatGroup.groupProfile;
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
                pfp={profileName || images.avatar}
                name={profileName}
                date={recentDate}
                recentMsg={recentMessage || 'No recent message'}
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
          onUserSelection={handleSelectedUsers} // Pass selected users to the group chat
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
