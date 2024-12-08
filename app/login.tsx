import { COLORS, icons, images } from "@/constants";
import { Image } from "expo-image";
import { ScrollView, View, StyleSheet, Text } from "react-native";
import Button from "@/components/Button";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/contexts/themeContext";
import { Formik } from "formik";
import { validationSignIn } from "@/components/Validation";
import Input from "@/components/CustomInput";
import { router } from "expo-router";

const Login = () => {
  const { dark } = useTheme();
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
                { fontSize: 20, fontWeight: "bold" },
                { color: dark ? COLORS.white : COLORS.black },
              ]}
            >
              Login
            </Text>
            <Text style={{ color: dark ? COLORS.white : COLORS.black }}>
              Login to your admin dashboard
            </Text>
            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={validationSignIn}
              onSubmit={() => router.push('/(tabs)')}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
              }) => {
                return <View>
                  <Input
                    value={values.email}
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    label="Email"
                    keyboardType="email-address"
                    errorText={
                      touched.email && errors.email ? errors.email : ""
                    }
                    showCheckbox={false}
                    prefilledValue={values.email}
                    id="email"
                  />
                  <Input
                    id="password"
                    value={values.password}
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    label="Password"
                    secureTextEntry
                    errorText={
                      touched.password && errors.password ? errors.password : ""
                    }
                    showCheckbox={false}
                    prefilledValue={values.password}
                  />
                  <Button title="Login" onPress={handleSubmit as any} />
                </View>
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
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },

  subContainer: {
    borderRadius: 20,
    width: "100%",
    paddingVertical: 20,
    paddingHorizontal: 18,
    gap: 10,
  },
});

export default Login;
