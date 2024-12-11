import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { DrawerActions } from '@react-navigation/native';
import { COLORS, icons, images } from '@/constants';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/themeContext';

const Header = ({ onPress }: { onPress: (props: any) => void }) => {
  const { dark } = useTheme();
  return (
    <SafeAreaView
      style={{ backgroundColor: dark ? COLORS.dark1 : COLORS.white }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: 10,
        }}
      >
        <Image
          source={images.tereSecrow}
          style={{ width: 80, height: 50, marginLeft: 10 }}
          contentFit="contain"
        />
        <TouchableOpacity
          style={{
            marginRight: 15,
            padding: 6,
          }}
          onPress={onPress}
        >
          <Image
            source={icons.hamburger}
            style={{ width: 24, height: 24 }}
            tintColor={dark ? COLORS.grayscale100 : COLORS.dark1}
            contentFit="contain"
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Header;

const styles = StyleSheet.create({});
