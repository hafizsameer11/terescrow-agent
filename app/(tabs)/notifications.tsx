import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/constants';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useTheme } from '@/contexts/themeContext';
import { useQuery } from '@tanstack/react-query';
import { getCustomerNotifications, getTeamNotifications } from '@/utils/queries/agentQueries';
import { useAuth } from '@/contexts/authContext';

const dummyNotifications = Array(7).fill({
  id: 1,
  person: 'Agent Sarah',
  description: 'sent you a chat...',
  time: 'Nov 7, 2024 - 10:22 am',
});

const Notifications = () => {
  const { dark } = useTheme();
  const textColor = {
    color: dark ? COLORS.white : COLORS.black,
  };
  const [activeBtn, setActiveBtn] = useState('notification');
  const { token } = useAuth();
  const [activeNotification, setActiveNotification] =
    useState('teamNotification');
    const {
      data: teamNotifications,
      isLoading: teamNotificationsLoading,
      isError: isTeamNotificationsError,
      error: teamNotificationsError,
    } = useQuery({
      queryKey: ['teamnotifications'],
      refetchInterval: 3000,
      queryFn: () => getTeamNotifications(token),
    });
    const {
      data: customerNotifications,
      isLoading: customerNotificationsLoading,
      isError: isCustomerNotificationsError,
      error: customerNotificationsError,
    } = useQuery({
      queryKey: ['customernotifications'],
      refetchInterval: 3000,
      queryFn: () => getCustomerNotifications(token),
    });
  const handlePressNotification = (btn: string) => {
    setActiveBtn(btn);
  };

  const handlePressContent = (btn: string) => {
    setActiveNotification(btn);
  };

  return (
    <View
      style={[
        styles.safeArea,
        { backgroundColor: dark ? COLORS.dark1 : COLORS.transparentWhite },
      ]}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.row}>
          <Text style={[styles.subHeader, textColor]}>Notifications</Text>
        
        </View>

        <View
          style={[
            styles.headerButtonsContainer,
            {
              borderColor: dark ? COLORS.dark2 : '#ccc',
              borderWidth: 1,
              marginBottom: 20,
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => handlePressContent('teamNotification')}
            style={[
              styles.button,
              activeNotification === 'teamNotification' && styles.activeButton,
            ]}
          >
            <Text
              style={[
                styles.buttonText,
                {
                  color:
                    activeNotification === 'teamNotification'
                      ? COLORS.white
                      : dark
                      ? COLORS.white
                      : COLORS.black,
                },
              ]}
            >
              Team Notification
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handlePressContent('customerNotification')}
            style={[
              styles.button,
              activeNotification === 'customerNotification' &&
                styles.activeButton,
            ]}
          >
            <Text
              style={[
                styles.buttonText,
                {
                  color:
                    activeNotification === 'customerNotification'
                      ? COLORS.white
                      : dark
                      ? COLORS.white
                      : COLORS.black,
                },
              ]}
            >
              Customer Notification
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <ScrollView
            contentContainerStyle={styles.itemsScrollCont}
            style={{ backgroundColor: dark ? COLORS.dark2 : COLORS.white }}
          >
            {activeNotification === 'teamNotification' && (
              <>
                <Text
                  style={[styles.subHeader, { paddingBottom: 10 }, textColor]}
                >
                  Team Notification
                </Text>
                {teamNotifications?.data.map((notification, index) => (
                  <View key={index}>
                    <Text style={[styles.person, textColor]}>
                      {notification.title}
                      <Text style={styles.description}>
                        {'  '}
                        {notification.description}
                       
                      </Text>
                    </Text>
                    <Text style={[styles.time]}>{notification.createdAt.slice(0, 10)}</Text>
                  </View>
                ))}
              </>
            )}
            {activeNotification === 'customerNotification' && (
              <>
                <Text
                  style={[styles.subHeader, { paddingBottom: 10 }, textColor]}
                >
                  Customer Notification
                </Text>
                {customerNotifications?.data.map((notification, index) => (
                  <View key={index}>
                    <Text style={[styles.person, textColor]}>
                      {notification.title}
                      <Text style={styles.description}>
                        {'  '}
                        {notification.description}
                        {/* <TouchableOpacity>
                          <Text style={styles.viewChat}>View Chat</Text>
                        </TouchableOpacity> */}
                      </Text>
                    </Text>
                    <Text style={[styles.time]}>{notification.createdAt.slice(0, 10)}</Text>
                  </View>
                ))}
              </>
            )}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 13,
  },
  itemsScrollCont: {
    padding: 20,
  },
  viewChat: {
    color: COLORS.primary,
    fontSize: 12,
  },
  items: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  description: {
    fontWeight: '400',
  },
  subHeader: {
    fontSize: 21,
    paddingBottom: 10,
    paddingTop: 20,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    width: '100%',
    gap: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  headerButtonsContainer: {
    flexDirection: 'row',
    borderRadius: 10,
    alignSelf: 'flex-start',
    alignItems: 'center',
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
    fontSize: 11,
    fontWeight: 'bold',
  },

  person: {
    fontWeight: 'bold',
    marginVertical: 7,
  },
  time: {
    fontSize: 12,
    color: COLORS.gray,
  },
});
