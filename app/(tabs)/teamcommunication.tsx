import { useState } from "react";
import { View, FlatList, ScrollView, StyleSheet } from "react-native";
import { useTheme } from "@/contexts/themeContext";
import { Colors } from "@/constants/Colors";
import TeamChatHeader from "@/components/TeamChatHeader";
import TeamChatSearch from "@/components/TeamChatSearch";
import TeamChatCategorys from "@/components/TeamChatCategorys";
import { DUMMY_ALL } from "@/utils/dummyAll";
import TeamChatContactList from "@/components/TeamChatContactList";
import TeamGroupModal from "@/components/TeamGroupModal";

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
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [modalVisibility, setModalVisibility] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<selectedPeopleGroup[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const selectCategoryHandler = (selected: string) => {
    setSelectedCategory(selected);
  };

  const modalVisibilityHandler = (modalState: boolean) => {
    setModalVisibility(modalState);
  };

  const filterDataHandler = (selectedItem: string) => {
    let filteredData = DUMMY_ALL;
    // Filter by category
    if (selectedItem === "Group") {
      filteredData = filteredData.filter((item) => item.group);
    } else if (selectedItem === "Unread") {
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
          data={filterDataHandler(selectedCategory)}
          style={styles.chatList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TeamChatContactList
              id={item.id.toString()}
              pfp={item.pfp}
              name={item.name}
              date={item.date}
              recentMsg={item.recentMessage}
              isDarkMode={dark}
            />
          )}
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
