import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useTheme } from '@/contexts/themeContext';
import { COLORS, icons } from '@/constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ProfileDetails from '@/components/ProfileDetails';
import EditProfileModal from '@/components/EditProfileModal';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { useRoute } from '@react-navigation/native';
import { usersData } from '@/utils/usersData';
import KYCModal from '@/components/KYCModal';
import Transactions from './transactions';
import FullTransactionModal from '@/components/TransactionDetailModal';
import { useQuery } from '@tanstack/react-query';
import { getCustomerDetails } from '@/utils/queries/adminQueries';
import { token } from '@/utils/apiConfig';
import { Customer } from '@/utils/queries/datainterfaces';
import AsyncStorage from '@react-native-async-storage/async-storage';

// interface Customer {
//   id: string;
//   name: string;
//   email: string;
//   image: string;
//   gender: string;
//   mobileNumber: string;
//   country: string;
// }


const Profile = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activeBtn, setActiveBtn] = useState('customerDetails');
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<String | null>(null);
  const [mode, setMode] = useState('editProfile');
  const [customerData, setCustomerData] = useState<Customer | null>(null);
  const [kycModalVisible, setKYCModalVisible] = useState(false);
  const [customerId, setCustomerId] = useState<string | null>(null);

  const { dark } = useTheme();

// Store or Retrieve Customer ID
useEffect(() => {
  const manageCustomerId = async () => {
    try {
      let storedId = id;

      if (!storedId) {
        storedId = await AsyncStorage.getItem("customerId");
      } else {
        await AsyncStorage.setItem("customerId", storedId);
      }

      if (storedId) setCustomerId(storedId);
    } catch (error) {
      console.error("Error managing customer ID:", error);
    }
  };
  manageCustomerId();
}, [id]);

console.log("Stored Customer ID:", customerId);

// Fetch Customer Details using React Query
const { data, isLoading, isError, error } = useQuery({
  queryKey: ["customerDetails", customerId],
  queryFn: () => getCustomerDetails({ token, id: customerId! }),
  enabled: Boolean(customerId),

  // Automatically refetch when customerId changes
  refetchOnWindowFocus: true,
  retry: 2,

  // Optional: Handle errors if needed
  onError: (error) => {
    console.error("Error fetching customer details:", error);
  },
});


  const customer: Customer | undefined = data?.data;
  const { email, phoneNumber, gender, country } = customer || {};

  // Handle Button Press
  const handlePress = (btn: string) => {
    setActiveBtn(btn);
  };

  // Modals Handlers
  const handlePressModal = () => setModalVisible(true);
  const handleKYCModal = () => setKYCModalVisible(true);

  // Image Selection Handler
  const handleImageSelect = (uri: string) => setSelectedImage(uri);

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
            { borderColor: dark ? COLORS.dark2 : '#ccc' },
          ]}
        >
          <TouchableOpacity
            onPress={() => handlePress('customerDetails')}
            style={[
              styles.button,
              activeBtn === 'customerDetails' && styles.activeButton,
            ]}
          >
            <Text
              style={[
                styles.buttonText,
                {
                  color:
                    activeBtn === 'customerDetails'
                      ? COLORS.white
                      : dark
                        ? COLORS.white
                        : COLORS.black,
                },
              ]}
            >
              Customer Details
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handlePress('transactionActivities')}
            style={[
              styles.button,
              activeBtn === 'transactionActivities' && styles.activeButton,
            ]}
          >
            <Text
              style={[
                styles.buttonText,
                {
                  color:
                    activeBtn === 'transactionActivities'
                      ? COLORS.white
                      : dark
                        ? COLORS.white
                        : COLORS.black,
                },
              ]}
            >
              Transaction Activities
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 10 }}>
          {activeBtn === 'customerDetails' && (
            <>
              <View style={styles.profileContainer}>
                <View style={styles.profileAvatar}>
                  {selectedImage ? (
                    <Image
                      source={{ uri: selectedImage }}
                      style={styles.profileAvatarImage}
                    />
                  ) : (
                    <Text style={styles.profileAvatarText}>
                      {customer?.username}
                    </Text>
                  )}
                </View>

                <View style={styles.profileDetails}>
                  <Text style={styles.profileName}>{customer?.username}</Text>
                  <Text style={styles.profileSubDetails}>
                    {customer?.username} - {'Tier 2'}
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <TouchableOpacity
                    style={[
                      styles.profileEditButton,
                      { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
                    ]}
                    onPress={handlePressModal}
                  >
                    <Image
                      source={icons.edit}
                      style={[
                        styles.editIcon,
                        { tintColor: dark ? COLORS.white : COLORS.black },
                      ]}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.profileEditButton,
                      { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
                    ]}
                    onPress={handleKYCModal}
                  >
                    <Image
                      source={icons.menu}
                      style={[
                        styles.editIcon,
                        { tintColor: dark ? COLORS.white : COLORS.black },
                      ]}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <ProfileDetails
                email={email}
                phoneNumber={phoneNumber}
                gender={gender}
                country={country}
              />

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
                <View
                  style={[
                    styles.accountActivitiesSubContainer,
                    { borderBottomWidth: 1, borderColor: '#ccc' },
                  ]}
                >
                  <Text
                    style={[
                      styles.accountActivitiesSubTitle,
                      { color: dark ? COLORS.white : COLORS.black },
                    ]}
                  >
                    Date Joined
                  </Text>
                  <Text style={{ color: dark ? COLORS.white : COLORS.black }}>
                    Nov 7, 2024 - 4:30PM
                  </Text>
                </View>
              </View>
            </>
          )}

          {activeBtn === 'transactionActivities' && (
            <Transactions isShown={false} customerId={customerId!} />
          )}
        </View>

        <EditProfileModal
          visible={isModalVisible}
          onClose={() => setModalVisible(false)}
          userName={customer?.username}
          mode="editProfile"
          onImageSelect={handleImageSelect}
          setMode={setMode}
        />
        <KYCModal
          visible={kycModalVisible}
          onClose={() => setKYCModalVisible(false)}
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
  scrollContainer: {
    paddingHorizontal: 13,
  },
  editIcon: {
    width: 15,
    height: 15,
  },
  headerButtonsContainer: {
    flexDirection: 'row',
    borderRadius: 10,
    borderWidth: 1,
    alignSelf: 'flex-start',
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
  buttonText: {
    fontWeight: 'bold',
  },
  profileContainer: {
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    padding: 20,
    height: 135,
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
    marginBottom: 5,
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
    justifyContent: 'flex-end',
    marginTop: 60,
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
    marginBottom: 20,
    elevation: 5,
  },
  accountActivitiesTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  accountActivitiesSubContainer: {
    paddingVertical: 12,
  },
  accountActivitiesSubTitle: {
    fontWeight: 'bold',
  },
});
