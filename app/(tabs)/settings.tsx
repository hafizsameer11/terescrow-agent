import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { useTheme } from '@/contexts/themeContext';
import { COLORS } from '@/constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ProfileDetails from '@/components/ProfileDetails';
import EditProfileModal from '@/components/EditProfileModal';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@/contexts/authContext';
import { router } from 'expo-router';

const Profile = () => {
  const [user, setUser] = useState({
    name: 'Qamardeen Abulmalik',
    username: '@Alucard',
    email: 'admin@gmail.com',
    owner: 'Owner',
    gender: 'M',
    date: 'Nov 7, 2024',
    tier: 'Tier 2',
  });

  const { name } = user;
  const [activeBtn, setActiveBtn] = useState('profile');
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<String | null>(null);
  const [mode, setMode] = useState('editProfile');
  const { dark } = useTheme();
  const { token, userData } = useAuth();
  const userInitial = name.charAt(0).toUpperCase();
  const { logout } = useAuth();
  const handlePress = (btn: string) => {
    setActiveBtn(btn);
  };

  const handlePressModal = () => {
    setModalVisible(true);
  };

  const handleImageSelect = (uri: string) => {
    setSelectedImage(uri);
  };

  const handleLogout = () => {
    // logout();
    // router.replace('');
    // setUser(null); naviage to login using replace methode

  };
  return (
    <View
      style={[
        styles.safeArea,
        { backgroundColor: dark ? COLORS.dark1 : COLORS.transparentWhite },
      ]}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        <View
          style={[
            styles.headerButtonsContainer,

          ]}
        >


          {/* <TouchableOpacity
            onPress={() => handleLogout()}
            style={[
              styles.button,
              styles.logOutButton,
            ]}
          >
            <Text
              style={[
                styles.buttonText,
                {
                  color:
                    activeBtn === 'profile'
                      ? COLORS.white
                      : dark
                        ? COLORS.white
                        : COLORS.black,
                },
              ]}
            >
              Logout
            </Text>
          </TouchableOpacity> */}
        </View>



        <View style={styles.profileContainer}>
          <View style={styles.profileAvatar}>
            {selectedImage ? (
              <Image
                source={{ uri: selectedImage }}
                style={styles.profileAvatarImage}
              />
            ) : (
              <Text style={styles.profileAvatarText}>{userInitial}</Text>
            )}
          </View>
          <View style={styles.profileDetails}>
            <Text style={styles.profileName}>{userData?.username}</Text>
            <Text style={styles.profileSubDetails}>{userData?.role}</Text>
          </View>
          <TouchableOpacity
            style={[
              styles.profileEditButton,
              { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
            ]}
            onPress={handlePressModal}
          >
            <Text style={styles.profileEditButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
        <View
          style={[
            styles.accountActivitiesContainer,
            { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
          ]}
        >
          <Text
            style={[
              {
                color: dark ? COLORS.white : COLORS.black,
              },
              styles.details,
            ]}
          >
            Personal Details
          </Text>
          <View style={styles.accountActivitiesSubContainer}>
            <Text
              style={[
                styles.accountActivitiesSubTitle,
                {
                  color: dark ? COLORS.white : COLORS.black,
                  fontWeight: '400',
                },
              ]}
            >
              <Text style={{ fontWeight: 'bold' }}>Email:</Text> {userData?.email}
            </Text>
            <Text
              style={[
                styles.accountActivitiesSubTitle,
                {
                  color: dark ? COLORS.white : COLORS.black,
                  fontWeight: '400',
                },
              ]}
            >
              <Text style={{ fontWeight: 'bold' }}>Gender:</Text> {userData?.gender}
            </Text>
            {/* <Text
              style={[
                styles.accountActivitiesSubTitle,
                {
                  color: dark ? COLORS.white : COLORS.black,
                  fontWeight: '400',
                },
              ]}
            >
              <Text style={{ fontWeight: 'bold' }}>Date Added:</Text>{' '}
              {userData?.createdAt}
            </Text> */}
          </View>
        </View>
        <View
          style={[
            styles.accountActivitiesContainer,
            { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
          ]}
        >
          <Text
            style={[
              styles.accountActivitiesTitle,
              { color: dark ? COLORS.white : COLORS.black },
            ]}
          >
            Account Activities
          </Text>

          <View>

            {userData?.accountActivity?.map((item, index) => (
              <Text
                key={index}
                style={[
                  styles.accountActivitiesSubTitle,
                  { fontWeight: 'bold', color: dark ? COLORS.white : COLORS.black },
                ]}
              >

                <Text style={{ fontWeight: '400' }}>  {item.description}</Text>
                <Text style={{ fontWeight: '200', fontSize: 10 }}>  {item.createdAt.split('T')[0]}</Text>
              </Text>
            ))}
          </View>
        </View>
        {
          userData?.role !== 'admin' &&
          <View
            style={[
              styles.accountActivitiesContainer,
              { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
            ]}
          >
            <Text
              style={[
                styles.accountActivitiesTitle,
                { color: dark ? COLORS.white : COLORS.black },
              ]}
            >
              Department Assigned
            </Text>
            <View>

              {userData?.assignedDepartments?.map((item, index) => (
                <Text
                  key={index}
                  style={[
                    styles.accountActivitiesSubTitle,
                    { fontWeight: 'bold', color: dark ? COLORS.white : COLORS.black },
                  ]}
                >
                  Title:
                  <Text style={{ fontWeight: '400' }}>  {item.department.title}</Text>
                </Text>
              ))}
            </View>

          </View>
        }
        <EditProfileModal
          visible={isModalVisible}
          onClose={() => setModalVisible(false)}
          userName={user.name}
          mode="editProfile"
          onImageSelect={handleImageSelect}
          setMode={setMode}
        />
      </ScrollView>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  details: {
    fontWeight: 'bold',
    fontSize: 16,
    borderBottomWidth: 1,
    paddingVertical: 10,
    borderColor: '#ccc',
  },
  scrollContainer: {
    paddingHorizontal: 13,
  },
  headerButtonsContainer: {
    flexDirection: 'row',
    borderRadius: 10,

    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'transparent'
    // alignSelf: 'flex-start',
  },
  profileAvatarImage: {
    width: 70,
    height: 70,
    borderRadius: 50,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: 'transparent',
  },
  activeButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
  },
  logOutButton: {
    backgroundColor: COLORS.red,
    borderRadius: 10,
  },
  buttonText: {
    fontWeight: 'bold',
  },

  profileContainer: {
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    padding: 20,
    height: 130,
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  profileDetails: {
    flexDirection: 'column',
    flex: 1,
    marginLeft: 15,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  profileSubDetails: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.8,
  },
  profileEditButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
    position: 'absolute',
    right: 0,
    top: 15,
  },
  profileEditButtonText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  profileAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileAvatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  accountActivitiesContainer: {
    padding: 13,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 30,
  },
  accountActivitiesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10,
  },

  accountActivitiesSubContainer: {
    paddingBottom: 15,
  },

  accountActivitiesSubTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginVertical: 10,
  },
});
