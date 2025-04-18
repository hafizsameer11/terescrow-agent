import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { DrawerActions, NavigationProp } from '@react-navigation/native';
import { COLORS, icons, images } from '@/constants';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/themeContext';
import { useAuth } from '@/contexts/authContext';
import { useQuery } from '@tanstack/react-query';
import * as Notifications from "expo-notifications";
import { getunreadMessageCount } from '@/utils/queries/commonQueries';
import { useNavigation } from 'expo-router';
import { router } from 'expo-router';
import AsyncStorage from "@react-native-async-storage/async-storage";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});
const Header = ({ onPress }: { onPress: (props: any) => void }) => {
  const { dark } = useTheme();
  const { token, userData } = useAuth();

  const { navigate, reset } = useNavigation<NavigationProp<any>>();
  const { data: count } = useQuery({
    queryKey: ['notificationCount'],
    queryFn: () => getunreadMessageCount(token),
    refetchInterval: 5000,
  });
  const [previeusCount, setPreviousCount] = useState(0);

  useEffect(() => {
    const checkAndRequestPermissions = async () => {
      try {
        const hasAskedBefore = await AsyncStorage.getItem("hasAskedNotificationPermission");

        if (!hasAskedBefore) {
          const { status } = await Notifications.requestPermissionsAsync({
            ios: {
              allowAlert: true,
              allowSound: true,
              allowBadge: true,
            },
          });

          if (status === "granted") {
            console.log("Notification permissions granted");
          } else {
            console.warn("Notification permissions not granted");
          }

          // Save that the permission was asked
          await AsyncStorage.setItem("hasAskedNotificationPermission", "true");
        }
      } catch (error) {
        console.error("Error checking or requesting notification permissions:", error);
      }
    };

    checkAndRequestPermissions();
  }, []);

  // Trigger push notification on count changes
  useEffect(() => {
    if (count?.data > previeusCount) {
      pushNotification(count?.data - previeusCount);
    }
    setPreviousCount(count?.data || 0);
  }, [count]);

  // Push notification function
  const pushNotification = async (newMessages) => {
    const content = {
      title: "New Messages!",
      body: `You have ${newMessages} new messages.`,
      sound: "default", // Play default notification sound
      data: { count: newMessages },
    };

    await Notifications.scheduleNotificationAsync({
      content,
      trigger: null, // Show immediately
    });
  };


  useEffect(() => {
    if (count) {
      console.log('count', count);
    }
  }, [count]);
  const handleNotification = () => {
    router.push('/notifications');
  }
  return (
    <SafeAreaView
      style={{ backgroundColor: dark ? COLORS.dark1 : COLORS.white, marginBottom: 18 }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: 10,
        }}
      >
        {/* Logo */}
        <Image
          source={images.logo1}
          style={{ width: 80, height: 50, marginLeft: 10 }}
          contentFit="contain"
        />

        {/* Icons (Hamburger + Notification) */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15 }}>
          {/* Notification Icon */}
          <TouchableOpacity style={styles.icon} onPress={handleNotification}>
            <Image
              source={icons.notification}
              style={{ width: 24, height: 24 }}
              tintColor={dark ? COLORS.grayscale100 : COLORS.dark1}
              contentFit="contain"
            />
            {/* Notification Count */}

            <View style={styles.badge}>
              <Text style={styles.badgeText}>{count?.data}</Text>
            </View>

          </TouchableOpacity>

          {/* Hamburger Menu Icon */}
          <TouchableOpacity style={styles.icon} onPress={onPress}>
            <Image
              source={icons.hamburger}
              style={{ width: 24, height: 24 }}
              tintColor={dark ? COLORS.grayscale100 : COLORS.dark1}
              contentFit="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Header;

const styles = StyleSheet.create({
  icon: {
    marginLeft: 15,
    padding: 6,
    position: 'relative', // Ensure relative positioning for the badge
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: COLORS.red, // Use a red background for the badge
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
});
