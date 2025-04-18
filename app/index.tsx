import { COLORS, icons, images } from '@/constants';
import { Image } from 'expo-image';
import { ScrollView, View, StyleSheet, Text } from 'react-native';
import Button from '@/components/Button';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/themeContext';
import { Formik } from 'formik';
import { validationSignIn } from '@/components/Validation';
import Input from '@/components/CustomInput';
import { router, useNavigation } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { loginAgent, loginUser } from '@/utils/mutations/commonMutations';
import { useAuth } from '@/contexts/authContext';
import { NavigationProp } from '@react-navigation/native';
import { ApiError } from '@/utils/customApiCalls';
import { showTopToast } from '@/utils/helpers';
import Login from './login';

export const handleLogout = () => {
  console.log("handleLogout")
  router.replace('/'); // Navigate to login or the root screen
};
const index = () => {
  


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Login />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    padding: 20,
  },

  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },

  subContainer: {
    borderRadius: 20,
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 18,
    gap: 10,
  },
});

export default index;
