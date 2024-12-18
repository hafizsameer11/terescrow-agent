import { router, Tabs } from "expo-router";
import React from "react";
import {
  ImageSourcePropType,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Drawer } from "expo-router/drawer";
import { COLORS, icons, images } from "@/constants";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Image } from "expo-image";
import { bottomMenuItems, topMenuItems } from "@/utils/data";
import Header from "@/components/Header";
import { useTheme } from "@/contexts/themeContext";
import { useAuth } from "@/contexts/authContext";

export default function TabLayout() {
  const { dark } = useTheme();
  const { userData } = useAuth();

  const Separater = () => {
    return (
      <View
        style={{
          height: 1,
          marginVertical: 20,
          marginHorizontal: 25,
          backgroundColor: COLORS.greyscale300,
        }}
      />
    );
  };

  console.log(userData);

  const CustomDrawer = (props: DrawerContentComponentProps) => {
    return (
      <DrawerContentScrollView {...props}>
        <View
          style={{
            flexDirection: "row",
            marginLeft: 27,
            marginTop: 25,
            marginBottom: 30,
          }}
        >
          <TouchableOpacity>
            <Image
              source={userData?.profilePicture || images.avatar}
              style={{ width: 74, height: 74, borderRadius: 50 }}
              contentFit="contain"
            />
          </TouchableOpacity>
          <View style={{ padding: 12, justifyContent: "space-between" }}>
            <Text style={{ fontSize: 20, fontWeight: "400", lineHeight: 22.8 }}>
              Welcome
            </Text>
            <Text style={{ fontSize: 14, fontWeight: "400", lineHeight: 16 }}>
              {userData?.username}
            </Text>
          </View>
        </View>

        {topMenuItems
          .filter((item) => item.roles.includes(String(userData?.role)))
          .map((item, index) => (
            <DrawerItem
              style={{ marginVertical: -2 }}
              label={item.title}
              key={item.name}
              onPress={() => {
                props.navigation.navigate(item.name);
              }}
              icon={({ size, color }) => (
                <Image
                  source={item.icon}
                  style={{ width: size, height: size }}
                  contentFit="contain"
                  tintColor={color}
                />
              )}
              labelStyle={{ fontSize: 16, fontWeight: "700", lineHeight: 18.2 }}
              activeTintColor={COLORS.primary}
              activeBackgroundColor="transparent"
              focused={
                props.state?.routes[props.state?.index]?.name == item.name
              }
            />
          ))}

        <Separater />

        {bottomMenuItems.map((item, index) => (
          <DrawerItem
            style={{ marginVertical: -2 }}
            label={item.title}
            key={item.name}
            onPress={() => {
              props.navigation.navigate(item.name);
            }}
            icon={({ size, color }) => (
              <Image
                source={item.icon}
                style={{ width: size, height: size }}
                contentFit="contain"
                tintColor={color}
              />
            )}
            labelStyle={{ fontSize: 16, fontWeight: "700", lineHeight: 18.2 }}
            activeTintColor={COLORS.primary}
            activeBackgroundColor="transparent"
            focused={props.state?.routes[props.state?.index]?.name == item.name}
          />
        ))}
        <Separater />
      </DrawerContentScrollView>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          drawerActiveTintColor: COLORS.primary,
          drawerActiveBackgroundColor: COLORS.white,
          // headerShown: false,
          // headerStyle: {
          //   backgroundColor: dark ? COLORS.dark1 : COLORS.transparentWhite,
          // },
          header: (props) => (
            <Header onPress={() => props.navigation.openDrawer()} />
          ),
        }}
        drawerContent={(props) => <CustomDrawer {...props} />}
      />
    </GestureHandlerRootView>
  );
}
