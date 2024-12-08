import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import { Image } from "expo-image";
import { COLORS, icons, images } from "@/constants";
import { router } from "expo-router";
import { useTheme } from "@/contexts/themeContext";

const TeamProfile: React.FC<{
  name: string;
  userName: string;
  profileImage: string;
}> = ({ name, userName, profileImage }) => {
  const { dark } = useTheme();
  return (
    <View style={[styles.container, dark && { backgroundColor: COLORS.black }]}>
      {/* Header with Menu Icon */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.closeIconCnntainer}
        >
          <Image
            source={icons.close2}
            style={[styles.closeIcon, dark && { tintColor: COLORS.black }]}
          />
        </Pressable>
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image source={profileImage} style={styles.profileImage} />
        <Text style={[styles.profileName, dark && { color: COLORS.white }]}>
          {name}
        </Text>
        <Text style={styles.profileUsername}>{userName}</Text>
      </View>

      {/* Menu Options */}
      <View style={styles.menuOptions}>
        <TouchableOpacity style={styles.menuItem}>
          <Image
            source={icons.noVol}
            style={[styles.menuIcon, dark && { tintColor: COLORS.white }]}
          />
          <Text style={[styles.menuText, dark && { color: COLORS.white }]}>
            Mute Notification
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Image source={icons.deletePng} style={styles.menuIcon} />
          <Text style={[styles.menuText, { color: COLORS.red }]}>
            Delete Chat
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Image
            source={icons.report}
            style={[
              styles.menuIcon,
              dark && { tintColor: COLORS.grayscale400 },
            ]}
          />
          <Text style={[styles.menuText, { color: COLORS.grayscale400 }]}>
            Report Chat
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingVertical: 25,
    paddingRight: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayscale400,
  },
  closeIconCnntainer: {
    padding: 5,
    borderRadius: 50,
    backgroundColor: COLORS.grayscale400,
  },
  closeIcon: { width: 18, height: 18, tintColor: COLORS.white },
  profileSection: {
    alignItems: "center",
    marginTop: 26,
    paddingBottom: 21,
    borderBottomWidth: 1,
    borderColor: COLORS.grayscale400,
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 50,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
  },
  profileUsername: {
    fontSize: 14,
    marginTop: 9,
    color: "#888",
  },
  menuOptions: {
    marginTop: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
  },
  menuIcon: {
    width: 20,
    height: 20,
    marginLeft: 15,
    marginRight: 10,
  },
  menuText: {
    fontSize: 16,
    color: "#333",
  },
});

export default TeamProfile;
