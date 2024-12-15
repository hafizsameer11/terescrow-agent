import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { COLORS, icons } from '@/constants';
import { Image } from 'expo-image';

interface Proptypes {
  label: string;
  text: string;
}

const StaticInput = ({ label, text }: Proptypes) => {
  return (
    <TouchableOpacity activeOpacity={0.8} style={styles.container}>
      <View>
        <Text style={styles.label}>{label}</Text>
        <Text
          style={{
            fontSize: 15,
            color: COLORS.greyscale900,
          }}
        >
          {text}
        </Text>
      </View>
      {/* <Image source={icons.arrowDown} style={{ width: 20, height: 20 }} /> */}
    </TouchableOpacity>
  );
};

export default StaticInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.grayscale400,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  label: {
    fontSize: 10,
    marginBottom: 5,
    color: COLORS.greyscale600,
  },
});
