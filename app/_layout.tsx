import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { ThemeProvider } from '@/contexts/themeContext';

import { useColorScheme } from '@/hooks/useColorScheme';
import { SocketProvider } from '@/contexts/socketContext';
import { AuthProvider } from '@/contexts/authContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({});

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <QueryClientProvider client={new QueryClient()}>
        <SocketProvider>
          <ThemeProvider>
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="login" options={{ headerShown: false }} />
              {/* <Stack.Screen name="profile" options={{ headerShown: false }} />
              <Stack.Screen name="customer" options={{ headerShown: false }} />
              <Stack.Screen name="rate" options={{ headerShown: false }} />
              <Stack.Screen
                name="notifications"
                options={{ headerShown: false }}
              />
              <Stack.Screen name="teams" options={{ headerShown: false }} />
              <Stack.Screen name="settings" options={{ headerShown: false }} />
              <Stack.Screen
                name="transactions"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="department"
                options={{ headerShown: false }}
              /> */}
              {/* <Stack.Screen name="log" options={{ headerShown: false }} /> */}
              <Stack.Screen name="+not-found" />
              <Stack.Screen name="userchat" options={{ headerShown: false }} />
              {/* <Stack.Screen name="users" options={{ headerShown: false }} /> */}
              <Stack.Screen
                name="editteamchat"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="transactionchat"
                options={{ headerShown: false }}
              />
            </Stack>
            <StatusBar style="auto" />
            <Toast />
          </ThemeProvider>
        </SocketProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}
