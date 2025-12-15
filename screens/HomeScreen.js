import React, { useState, useEffect, useCallback } from "react";
import {
 View,
 Text,
 TouchableOpacity,
 Image,
 ScrollView,
 Dimensions,
 Alert,
 TextInput,
} from "react-native";
import { styles } from "./styles/HomeScreenStyle.js";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
 listenForNotifications,
 registerForPushNotificationsAsync,
} from "../services/NotificationService";
import { useFocusEffect } from "@react-navigation/native";

const API_BASE_URL = "https://aquameter-backend-8u1x.onrender.com";
const screenWidth = Dimensions.get("window").width;

const HomeScreen = ({ navigation }) => {
 const [firstName, setFirstName] = useState("");
 const [profileImage, setProfileImage] = useState(null);
 const [userId, setUserId] = useState(null);
 const [token, setToken] = useState(null);

 // **[REMOVED: deviceStatus and deviceInfo states]**
 // const [deviceStatus, setDeviceStatus] = useState(null);
 // const [deviceInfo, setDeviceInfo] = useState(null);

 const [waterRate, setWaterRate] = useState("");

 // Function to handle the water rate update API call (UNMODIFIED)
 const updateWaterRate = async () => {
  if (!waterRate || isNaN(waterRate) || Number(waterRate) < 0) {
   Alert.alert("Invalid Rate", "Please enter a valid non-negative number.");
   return;
  }

  try {
   const rateToUpdate = Number(waterRate);
   const response = await fetch(`${API_BASE_URL}/rate/${userId}`, {
    method: "PUT",
    headers: {
     "Content-Type": "application/json",
     Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ rate: rateToUpdate }),
   });

   const data = await response.json();

   if (response.ok) {
    Alert.alert("Success", "Water rate updated!");

    // Update AsyncStorage with the new rate
    const storedUser = JSON.parse(await AsyncStorage.getItem("user"));
    if (storedUser) {
     storedUser.water_rate = rateToUpdate;
     await AsyncStorage.setItem("user", JSON.stringify(storedUser));
    }
   } else {
    Alert.alert("Error", data.error || "Failed to update rate");
   }
  } catch (err) {
   console.error("updateWaterRate error:", err);
   Alert.alert("Error", "Unable to update water rate.");
  }
 };

 // Loads user data from AsyncStorage (UNMODIFIED LOGIC)
 const loadStoredUser = async () => {
  try {
   const storedUser = await AsyncStorage.getItem("user");
   const storedToken = await AsyncStorage.getItem("token");

   if (!storedUser || !storedToken) return false;

   const parsed = JSON.parse(storedUser);
   setUserId(parsed.user_id);
   setFirstName(parsed.first_name || "");
   setToken(storedToken);
   setWaterRate(parsed.water_rate ? String(parsed.water_rate) : "");

   if (parsed.profile_image) {
    const img = parsed.profile_image.startsWith("http")
     ? parsed.profile_image
     : `${API_BASE_URL}${parsed.profile_image}`;
    setProfileImage(img);
   } else {
    setProfileImage(null);
   }

   return true;
  } catch (err) {
   console.error("loadStoredUser error:", err);
   return false;
  }
 };

 /**
 * Fetches latest user data from backend. (UNMODIFIED)
 */
 const fetchUserFromBackend = async (uid, tok) => {
  try {
   const response = await fetch(`${API_BASE_URL}/profile/${uid}`, {
    headers: { Authorization: `Bearer ${tok}` },
   });

   const data = await response.json();

   if (response.ok && data.success && data.user) {
    setFirstName(data.user.first_name || ""); 
    setWaterRate(data.user.water_rate ? String(data.user.water_rate) : ""); 

    if (data.user.profile_image) {
     const url = data.user.profile_image.startsWith("http")
      ? data.user.profile_image
      : `${API_BASE_URL}${data.user.profile_image}`;
     setProfileImage(url);
    } else {
     setProfileImage(null);
    }

    await AsyncStorage.setItem("user", JSON.stringify(data.user));
   }
  } catch (err) {
   console.error("fetchUserFromBackend error:", err);
  }
 };

 // **[REMOVED: fetchDeviceStatus function]**
 /*
 const fetchDeviceStatus = async () => {
  // ... (logic removed)
 };
 */

 // Load user on screen focus (UNMODIFIED LOGIC)
 useFocusEffect(
  useCallback(() => {
   let isActive = true;
   (async () => {
    const ok = await loadStoredUser();
    
    if (ok) {
     const storedUser = JSON.parse(await AsyncStorage.getItem("user"));
     const storedToken = await AsyncStorage.getItem("token");
     if (isActive) {
      await fetchUserFromBackend(storedUser.user_id, storedToken);
     }
    }
   })();
   return () => {
    isActive = false;
   };
  }, [])
 );

 // Initial load and notification setup (UNMODIFIED LOGIC)
 useEffect(() => {
  (async () => {
   if (!userId || !token) {
    await loadStoredUser();
   }
  })();

  const unsubscribe = listenForNotifications((notif) => {
   Alert.alert(notif.request.content.title, notif.request.content.body);
  });

  return () => unsubscribe && unsubscribe();
 }, []);

 // **[REMOVED: Polling useEffect]**
 /*
 useEffect(() => {
  let interval = null;

  if (userId && token) {
   fetchDeviceStatus();

   interval = setInterval(() => {
    fetchDeviceStatus();
   }, 10000);
  }

  return () => clearInterval(interval);
 }, [userId, token]);
 */

 // Function to navigate to profile screen (UNMODIFIED)
 const navigateToProfile = () => {
  navigation.navigate("ProfileScreen", { user_id: userId });
 };

 // Function to navigate to device status screen (NEW)
 const navigateToDeviceStatus = () => {
  // Pass userId and token to the new screen
  navigation.navigate("DeviceStatusScreen", { user_id: userId, token: token });
 };
 
 return (
  <View style={styles.container}>
   {/* HEADER (UNMODIFIED) */}
   <View style={styles.header}>
    <TouchableOpacity style={styles.headerLeft} onPress={navigateToProfile}>
     <View style={styles.profileCircle}>
      <Image
       source={
        profileImage
         ? { uri: profileImage }
         : {
           uri: `https://via.placeholder.com/150/1E3D6B/FFFFFF?text=${
            firstName ? firstName[0].toUpperCase() : "U"
           }`,
          }
       }
       style={styles.profileImage}
      />
     </View>
     <Text style={styles.greeting}>Hello, {firstName || "User"}!</Text>
    </TouchableOpacity>
    <View style={{ width: 28 }} />
   </View>

   <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
    {/* Date Section (UNMODIFIED) */}
    <View style={styles.dateContainer}>
     <Text style={styles.dayText}>
      {new Date().toLocaleDateString("en-US", { weekday: "long" })}
     </Text>
     <Text style={styles.dateText}>
      {new Date().toLocaleDateString("en-US", {
       month: "long",
       day: "numeric",
       year: "numeric",
      })}
     </Text>
    </View>

    <Text style={styles.sectionTitleDashboard}>Dashboard</Text>

    {/* Dashboard Cards (UNMODIFIED) */}
    <View style={styles.dashboard}>
     <TouchableOpacity
      style={[styles.card, { backgroundColor: "#1E3D6B" }]}
      onPress={() =>
       navigation.navigate("WaterConsumption", { user_id: userId })
      }
     >
      <Ionicons name="water" size={30} color="#fff" />
      <Text style={styles.cardTitle}>Water Consumption</Text>
      <Text style={styles.cardDetails}>View daily usage</Text>
     </TouchableOpacity>

     <TouchableOpacity
      style={[styles.card, { backgroundColor: "#2F4F6F" }]}
      onPress={() =>
       navigation.navigate("WaterBillRecords", { user_id: userId })
      }
     >
      <Ionicons name="receipt" size={30} color="#fff" />
      <Text style={styles.cardTitle}>Water Bill Records</Text>
      <Text style={styles.cardDetails}>Manage bills</Text>
     </TouchableOpacity>
    </View>

    {/* DEVICE STATUS (MODIFIED: Now a TouchableOpacity) */}
    <TouchableOpacity onPress={navigateToDeviceStatus} style={styles.deviceCardWrapper}>
     <View style={styles.deviceCard}>
      <Text style={styles.deviceCardTitle}>Device Status</Text>
      {/* Show a simple prompt to check the status on the new screen */}
      <Text style={styles.deviceCardSubtitle}>
       Tap to view device details and live status.
      </Text>
      <Text style={styles.deviceStatusText}>
       View Details
      </Text>
     </View>
    </TouchableOpacity>

    {/* WATER RATE INPUT (UNMODIFIED) */}
    <View style={styles.waterRateContainer}>
     <Text style={styles.waterRateLabel}>Water Rate (₱ per m³)</Text>

     <TextInput
      placeholder="Enter rate (₱)"
      value={waterRate}
      onChangeText={setWaterRate}
      keyboardType="numeric"
      style={styles.waterRateInput}
     />

     <TouchableOpacity
      onPress={updateWaterRate}
      style={styles.waterRateButton}
     >
      <Text style={styles.waterRateButtonText}>Save Water Rate</Text>
     </TouchableOpacity>
    </View>

    {/* LINK TO TREND LINE SCREEN (UNMODIFIED) */}
    <TouchableOpacity
     onPress={() => navigation.navigate("TrendLineScreen")}
     style={styles.trendLineLink}
    >
     <Text style={styles.trendLineLinkText}>
      📊 Open Trend Line Analysis
     </Text>
    </TouchableOpacity>
   </ScrollView>

   {/* FOOTER (UNMODIFIED) */}
   <View style={styles.footer}>
    <TouchableOpacity
     style={styles.footerIcon}
     onPress={() =>
      navigation.navigate("TrendLineScreen", { user_id: userId })
     }
    >
     <Ionicons name="stats-chart-outline" size={28} color="#666" />
    </TouchableOpacity>

    <TouchableOpacity
     style={styles.footerIcon}
     onPress={() => navigation.navigate("HomeScreen", { user_id: userId })}
    >
     <View style={styles.activeIconWrapper}>
      <Ionicons name="home-sharp" size={28} color="#1E3D6B" />
     </View>
    </TouchableOpacity>

    <TouchableOpacity
     style={styles.footerIcon}
     onPress={navigateToProfile}
    >
     <Ionicons name="person-outline" size={28} color="#666" />
    </TouchableOpacity>
   </View>
  </View>
 );
};

export default HomeScreen;