import React, { useEffect } from "react";
import { Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Notifications from "expo-notifications";
import { listenForNotifications } from "./services/NotificationService";
import { app } from "./firebaseConfig";

// Screens
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import WaterConsumption from "./screens/WaterConsumption";
import ProfileScreen from "./screens/ProfileScreen";
import WaterBillRecords from "./screens/WaterBillRecords";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import NotificationScreen from "./screens/NotificationScreen";
import TrendLineScreen from "./screens/TrendLineScreen";
import DeviceStatusScreen from "./screens/DeviceStatusScreen"; // ✅ NEW

const Stack = createNativeStackNavigator();

// ✅ Notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  useEffect(() => {
    console.log("🚀 App mounted — setting up listeners...");

    // ✅ Start listening for notifications
    const cleanup = listenForNotifications();

    // ✅ Android notification channel
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return () => {
      if (cleanup) cleanup();
      console.log("🧹 Notification listeners cleaned up");
    };
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="LoginScreen"
      >
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="WaterConsumption" component={WaterConsumption} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="WaterBillRecords" component={WaterBillRecords} />
        <Stack.Screen
          name="ForgotPasswordScreen"
          component={ForgotPasswordScreen}
        />
        <Stack.Screen
          name="NotificationScreen"
          component={NotificationScreen}
        />
        <Stack.Screen name="TrendLineScreen" component={TrendLineScreen} />
        <Stack.Screen
          name="DeviceStatusScreen"
          component={DeviceStatusScreen}
        /> 
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
