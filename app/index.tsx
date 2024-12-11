import { icons, images } from '@/constants';
import { Ionicons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Button, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const index = () => {
  return (
    <SafeAreaView>
      <Button
        title="Login"
        onPress={() => {
          router.push('/login');
        }}
      />
    </SafeAreaView>
  );
};

export default index;
