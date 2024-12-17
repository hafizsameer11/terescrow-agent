import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RNPickerSelect from 'react-native-picker-select';
import { COLORS, icons } from '@/constants';
import { Image } from 'expo-image';
import { useTheme } from '@/contexts/themeContext';
import Box from '@/components/DashboardBox';
import RecentChats from '@/components/RecentChats';
import Header from '@/components/Header';
import { usersData } from '@/utils/usersData';
import { useAuth } from '@/contexts/authContext';

export default function HomeScreen() {
  const [selectedOption, setSelectedOption] = useState('Year');
  const [menuVisible, setMenuVisible] = useState<number | null>(null);
  const { dark } = useTheme();
  const {userData}=useAuth();
  const handleMenuToggle = (index: number) => {
    setMenuVisible(menuVisible === index ? null : index);
  };
  return (
    <View
      style={[
        styles.safeArea,
        { backgroundColor: dark ? COLORS.dark1 : COLORS.transparentWhite },
      ]}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* <Header /> */}
        <View style={styles.container}>
          <Text
            style={[
              styles.title,
              { color: dark ? COLORS.white : COLORS.black },
            ]}
          >
            Dashboard
          </Text>
          <View
            style={[
              styles.pickerContainer,
              { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
            ]}
          >
            <RNPickerSelect
              onValueChange={(value) => setSelectedOption(value)}
              value={selectedOption}
              items={[
                { label: 'Year', value: 'Year' },
                { label: 'Month', value: 'Month' },
                { label: 'Day', value: 'Day' },
              ]}
              style={pickerSelectStyles}
              useNativeAndroidPickerStyle={false}
              Icon={() => (
                <Image
                  source={icons.arrowDown}
                  style={{
                    width: 20,
                    height: 20,
                    padding: 10,
                    position: 'absolute',
                    right: -5,
                    top: 8,
                    tintColor: dark ? COLORS.white : COLORS.black,
                  }}
                />
              )}
            />
          </View>
        </View>
        {/* {u} */}
        {userData?.role === 'admin' ? (
          
        <View style={{ padding: 10 }}>
          <View style={styles.row}>
            <Box title="Total Income" value="$1,000" percentage={7} condition />
            <Box title="Total Inflow" value="$500" percentage={5} condition />
          </View>
          <View style={styles.row}>
            <Box
              title="Total Expense"
              value="$1,000"
              percentage={8}
              condition
            />
            <Box title="Total Outflow" value="$500" percentage={4} condition />
          </View>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              marginVertical: 15,
              color: dark ? COLORS.white : COLORS.black,
            }}
          >
            Rates
          </Text>
          <View style={styles.row}>
            <Box
              title="Crypto buy"
              value="$1,000"
              simpleText="Edit"
              condition={false}
            />
            <Box
              title="Crypto sell"
              value="$1,000"
              simpleText="Edit"
              condition={false}
            />
          </View>
          <View style={styles.row}>
            <Box
              title="Crypto buy"
              value="$1,000"
              simpleText="Edit"
              condition={false}
            />
            <Box
              title="Gift card sell"
              value="$1,000"
              simpleText="Edit"
              condition={false}
            />
          </View>
        </View>
        ):
        (  <View style={{ padding: 10 }}>
          <View style={styles.row}>
            <Box title="Total Chats" value="$1,000" percentage={7} condition />
            <Box title="SuccessFull Transactions" value="$500" percentage={5} condition />
          </View>
          <View style={styles.row}>
            <Box
              title="Pending Chats"
              value="$1,000"
              percentage={8}
              condition
            />
            <Box title="Declined Chats" value="$500" percentage={0} condition />
          </View>
       
        </View>

        )}
        <View>
          <RecentChats indexChats />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 10,
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    width: '100%',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    width: '100%',
  },
  boxContainer: {
    padding: 15,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 8,
    textAlign: 'center',
  },
  inputAndroid: {
    color: COLORS.grayscale400,
    fontSize: 16,
    paddingVertical: 8,
    paddingRight: 18,
  },
});
