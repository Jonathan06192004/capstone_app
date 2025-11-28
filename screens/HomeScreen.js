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

  const [deviceStatus, setDeviceStatus] = useState(null);
  const [deviceInfo, setDeviceInfo] = useState(null);

  const [waterRate, setWaterRate] = useState("");

  // Function to handle the water rate update API call
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

  // Loads user data from AsyncStorage
  const loadStoredUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      const storedToken = await AsyncStorage.getItem("token");

      if (!storedUser || !storedToken) return false;

      const parsed = JSON.parse(storedUser);
      setUserId(parsed.user_id);
      setFirstName(parsed.first_name || "");
      setToken(storedToken);
      setWaterRate(parsed.water_rate ? String(parsed.water_rate) : ""); // Load initial rate

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

  // Fetches latest user data from backend
  const fetchUserFromBackend = async (uid, tok) => {
    try {
      const response = await fetch(`${API_BASE_URL}/home/${uid}`, {
        headers: { Authorization: `Bearer ${tok}` },
      });

      const text = await response.text();
      const data = JSON.parse(text);

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

  // Fetches the status of the user's registered device
  const fetchDeviceStatus = async () => {
    if (!userId) return;

    try {
      const headers = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(`${API_BASE_URL}/device/${userId}`, {
        method: "GET",
        headers,
      });

      const text = await res.text();
      const data = JSON.parse(text);

      if (data.success && Array.isArray(data.devices)) {
        if (data.devices.length > 0) {
          const device = data.devices[0];
          setDeviceInfo(device);
          setDeviceStatus(device.device_status || null);
        } else {
          setDeviceInfo(null);
          setDeviceStatus(null);
        }
      }
    } catch (err) {
      console.error("fetchDeviceStatus error:", err);
      setDeviceInfo(null);
      setDeviceStatus(null);
    }
  };

  // Load user on screen focus (e.g., when returning from profile screen)
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

  // Initial load and notification setup
  useEffect(() => {
    // Initial data fetch if state variables are null
    (async () => {
      if (!userId || !token) {
        await loadStoredUser();
      }
    })();

    // Set up notification listener
    const unsubscribe = listenForNotifications((notif) => {
      Alert.alert(notif.request.content.title, notif.request.content.body);
    });

    return () => unsubscribe && unsubscribe();
  }, []);

  // Poll device status every 10 seconds if user is logged in
  useEffect(() => {
    let interval = null;

    if (userId) {
      fetchDeviceStatus();

      interval = setInterval(() => {
        fetchDeviceStatus();
      }, 10000);
    }

    return () => clearInterval(interval);
  }, [userId, token]); // Re-run if userId or token changes

  // Function to navigate to profile screen
  const navigateToProfile = () => {
    navigation.navigate("ProfileScreen", { user_id: userId });
  };

  // Function to handle notification press (e.g., navigate to a notification list)
  const handleNotificationsPress = () => {
    Alert.alert("Notifications", "This will navigate to your notifications list.");
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        {/* Profile Info (Clickable) */}
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

        {/* Header Right - Notifications */}
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={handleNotificationsPress}
        >
          <Ionicons name="notifications-outline" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Date Section */}
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

        {/* Dashboard Cards */}
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

        {/* DEVICE STATUS */}
        <View style={styles.deviceCardWrapper}>
          <View style={styles.deviceCard}>
            <Text style={styles.deviceCardTitle}>Device Status</Text>
            <Text style={styles.deviceCardSubtitle}>
              {deviceInfo?.device_serial
                ? `Serial: ${deviceInfo.device_serial}`
                : "No registered device found."}
            </Text>

            <Text style={styles.deviceStatusText}>
              {deviceInfo == null && deviceStatus == null
                ? "Connect a device"
                : deviceStatus === "Active"
                ? "🟢 Online"
                : "🔴 Offline"}
            </Text>
          </View>
        </View>

        {/* WATER RATE INPUT */}
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

        {/* LINK TO TREND LINE SCREEN */}
        <TouchableOpacity
          onPress={() => navigation.navigate("TrendLineScreen")}
          style={styles.trendLineLink}
        >
          <Text style={styles.trendLineLinkText}>
            📊 Open Trend Line Analysis
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* FOOTER */}
      <View style={styles.footer}>
        {/* Trend Line (Inactive) */}
        <TouchableOpacity
          style={styles.footerIcon}
          onPress={() =>
            navigation.navigate("TrendLineScreen", { user_id: userId })
          }
        >
          {/* Note: Inactive icons use the standard color (e.g., #666) */}
          <Ionicons name="stats-chart-outline" size={28} color="#666" />
        </TouchableOpacity>

        {/* Home (Active) */}
        <TouchableOpacity
          style={styles.footerIcon}
          onPress={() => navigation.navigate("HomeScreen", { user_id: userId })}
        >
          {/* Active icon is wrapped in the style for the floating effect */}
          <View style={styles.activeIconWrapper}>
            <Ionicons name="home" size={28} color="#1E3D6B" />
          </View>
        </TouchableOpacity>

        {/* Profile (Inactive) */}
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