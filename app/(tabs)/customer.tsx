import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RNPickerSelect from 'react-native-picker-select';
import { COLORS, icons } from '@/constants';
import { Image } from 'expo-image';
import { useTheme } from '@/contexts/themeContext';
import Box from '@/components/DashboardBox';
import RecentChats from '@/components/RecentChats';
import { getCustomerStats } from '@/utils/queries/adminQueries';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/authContext';

export default function Customer() {
  const [selectedOption, setSelectedOption] = useState('Year');
  const { dark } = useTheme();
  const { token, userData } = useAuth();
  const {
    data: customerStats,
    isLoading: customerStatsLoading,
    isError: isCustomerStatsError,
    error: customerStatsError,
  } = useQuery({
    queryKey: ['customerStats'],
    refetchInterval: 30000,
    queryFn: () => getCustomerStats(token),
    enabled: !!token && userData?.role === 'admin',
  });
  useEffect(() => {
    console.log('customerStats', customerStats);
  }, [customerStats]);
  return (
    <View
      style={[
        styles.safeArea,
        { backgroundColor: dark ? COLORS.dark1 : COLORS.transparentWhite },
      ]}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text
            style={[
              styles.title,
              { color: dark ? COLORS.white : COLORS.black },
            ]}
          >
            Customer
          </Text>
          {/* <View
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
          </View> */}
        </View>
        <View style={{ padding: 10 }}>
          <View style={styles.row}>
            {/* <Box title="Total Customers" value={customerStats?.data.users.toString() || '0'} condition={false} /> */}
            {/* <Box title="Active Customers" value={customerStats?.data?.verifiedUsers.toString() || '0'} condition={false} /> */}
          </View>
          {/* <View style={styles.row}>
            <Box
              title="Total Expense"
              value="$1,000"
              percentage={8}
              condition
            />
            <Box title="Total Outflow" value="$500" percentage={4} condition />
          </View> */}
        </View>
        <View style={{ minHeight: 300 }}>
          <RecentChats indexChats={false} />
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
