import messaging from "@react-native-firebase/messaging";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Alert, Platform } from "react-native";

const FASTAPI_URL = "https://clear-meter-fastapi-8z5e.onrender.com/save_token";

// 🔹 Request permission + register both Expo & Firebase tokens (NO CHANGE)
export async function registerForPushNotificationsAsync(userId) {
  let expoToken = null;
  let fcmToken = null;

  try {
    // ✅ Request notification permission
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      Alert.alert("Permission denied", "Enable notifications in settings.");
      return null;
    }

    // ✅ Get Expo Push Token (only on real devices)
    if (Constants.isDevice) {
      const expoResponse = await Notifications.getExpoPushTokenAsync();
      expoToken = expoResponse.data;
      console.log("📱 Expo Push Token retrieved successfully");
    }

    // ✅ Get Firebase FCM Token (updated to v22+ compatible syntax)
    await messaging().requestPermission();
    fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log("🔥 Firebase FCM Token retrieved successfully");
    }

    // ✅ Send tokens to backend if user is logged in
    if (userId && (expoToken || fcmToken)) {
      console.log("📤 Sending tokens to backend for user:", userId);
      await sendTokenToFastAPI(userId, expoToken, fcmToken);
    } else {
      console.log("⚠️ User not logged in — tokens not sent to backend");
    }

    return { expoToken, fcmToken };
  } catch (error) {
    console.error("❌ Error registering for notifications:", error);
    return null;
  }
}

// 🔹 Send both tokens to FastAPI backend (NO CHANGE)
async function sendTokenToFastAPI(userId, expoToken, fcmToken) {
  try {
    const response = await fetch(FASTAPI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        expo_token: expoToken,
        fcm_token: fcmToken,
      }),
    });

    const result = await response.json();
    console.log("✅ Tokens successfully sent to FastAPI:", result);
  } catch (err) {
    console.error("❌ Error sending tokens to backend:", err);
  }
}

// 🔹 Foreground listener for incoming notifications (UPDATED)
export function listenForNotifications() {
  // Firebase foreground listener
  const unsubscribeFirebase = messaging().onMessage(async (remoteMessage) => {
    console.log("📩 FCM Foreground message:", remoteMessage);

    // --- NEW LOGIC FOR HIGH USAGE ALERT ---
    const type = remoteMessage.data?.type;

    if (type === "HIGH_USAGE_ALERT") {
        const increase = remoteMessage.data.increase_percent || 'unknown';
        const newReading = remoteMessage.data.new_reading || 'N/A';
        const title = remoteMessage.notification?.title || "High Usage Alert";
        
        // Use the data payload to construct a custom, actionable message
        const body = `Your latest consumption (${newReading} units) is ${increase}% higher than your average.`;

        Alert.alert(
            title,
            body,
            [
                { text: "View Details", onPress: () => { 
                    // TODO: Implement navigation to the usage/details screen here
                    console.log("User wants to view usage details.");
                }},
                { text: "Later", style: "cancel" }
            ]
        );
    } else {
        // Default alert for all other notifications
        Alert.alert(
          remoteMessage.notification?.title || "New Notification",
          remoteMessage.notification?.body || "You have a new message."
        );
    }
  });

  // Expo foreground listener (NO CHANGE)
  const subscription = Notifications.addNotificationReceivedListener(
    (notification) => {
      console.log("📩 Expo Notification Received (Foreground):", notification);
      // NOTE: For consistency, if you send Expo notifications, you should 
      // ensure the payload structure mimics the FCM structure for the alert type.
    }
  );

  // ✅ Return cleanup
  return () => {
    unsubscribeFirebase();
    subscription.remove();
  };
}