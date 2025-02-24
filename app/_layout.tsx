import { Stack } from "expo-router";
import { ThemeProvider } from "../context/ThemeContext.js";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hideAsync(); // Hide splash screen after 1 seconds
    }, 1000);
  }, []);
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: true }}>
        <Stack.Screen
          name="index"
          options={{ title: "Todo App", headerShown: true }}
        />
        <Stack.Screen
          name="todo/[id]"
          options={{ title: "Update Todo", headerShown: true }}
        />
      </Stack>
    </ThemeProvider>
  );
}
