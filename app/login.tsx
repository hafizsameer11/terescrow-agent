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
import { loginUser } from '@/utils/mutations/commonMutations';
import { useAuth } from '@/contexts/authContext';
import { NavigationProp } from '@react-navigation/native';
import { ApiError } from '@/utils/customApiCalls';
import { showTopToast } from '@/utils/helpers';

const Login = () => {
  const { dark } = useTheme();
  const { setToken, setUserData } = useAuth();
  const { navigate, reset } = useNavigation<NavigationProp<any>>();

  const { mutate, isPending } = useMutation({
    mutationKey: ['login'],
    mutationFn: loginUser,
    onSuccess: async (data) => {
      console.log(data);
      // Automatically redirect to tabs when the login is successful
      setToken(data.token)
        .then((res) => {
          setUserData(data?.data);
          reset({
            index: 0,
            routes: [{ name: '(tabs)' }], // Reset the navigation stack to tabs
          });
          navigate('(tabs)'); // Navigate to the tabs directly
        })
        .catch((error) => {
          showTopToast({
            type: 'error',
            text1: 'Error',
            text2: error.message,
          });
        });
    },
    onError: (error: ApiError) => {
      showTopToast({
        type: 'error',
        text1: 'Error',
        text2: error.message,
      });
    },
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        style={{
          backgroundColor: dark ? COLORS.dark1 : COLORS.transparentWhite,
        }}
      >
        <View>
          <Image
            source={images.tereSecrow}
            style={{ width: 90, height: 90 }}
            contentFit="contain"
          />
        </View>
        <View style={styles.container}>
          <View
            style={[
              { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
              styles.subContainer,
            ]}
          >
            <Text
              style={[
                { fontSize: 20, fontWeight: 'bold' },
                { color: dark ? COLORS.white : COLORS.black },
              ]}
            >
              Login
            </Text>
            <Text style={{ color: dark ? COLORS.white : COLORS.black }}>
              Login to your admin dashboard
            </Text>
            <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={validationSignIn}
              onSubmit={(values) => {
                // Skip credential check and redirect to tabs directly
                mutate(values); // Correctly submit login cr
              }}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
              }) => {
                return (
                  <View>
                    <Input
                      value={values.email}
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      label="Email"
                      keyboardType="email-address"
                      errorText={
                        touched.email && errors.email ? errors.email : ''
                      }
                      showCheckbox={false}
                      prefilledValue={values.email}
                      id="email"
                    />
                    <Input
                      id="password"
                      value={values.password}
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      label="Password"
                      secureTextEntry
                      errorText={
                        touched.password && errors.password
                          ? errors.password
                          : ''
                      }
                      showCheckbox={false}
                      prefilledValue={values.password}
                    />
                    <Button
                      title="Login"
                      onPress={handleSubmit as any} // Triggers form submission
                      isLoading={isPending} // Displays loading indicator
                    />
                  </View>
                );
              }}
            </Formik>
          </View>
        </View>
      </ScrollView>
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

export default Login;
