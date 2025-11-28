import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles/NotificationScreenStyle.js";

const API_BASE_URL = "https://aquameter-backend-8u1x.onrender.com";

const NotificationScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch notifications from backend
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/notifications`);
        if (!response.ok) throw new Error("Failed to fetch notifications");
        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error("❌ Error fetching notifications:", error);
        Alert.alert("Error", "Unable to load notifications. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // ✅ Icon type handler (unchanged)
  const getIcon = (type) => {
    switch (type) {
      case "alert":
        return <Ionicons name="warning-outline" size={28} color="#E74C3C" />;
      case "bill":
        return <Ionicons name="water-outline" size={28} color="#3498DB" />;
      case "info":
        return <Ionicons name="information-circle-outline" size={28} color="#2ECC71" />;
      default:
        return <Ionicons name="notifications-outline" size={28} color="#555" />;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#3498DB" style={{ marginTop: 40 }} />
      ) : notifications.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 40, color: "#777" }}>
          No notifications yet
        </Text>
      ) : (
        <ScrollView style={styles.scrollView}>
          {notifications.map((notif) => (
            <View key={notif.id} style={styles.notificationCard}>
              <View style={styles.iconContainer}>{getIcon(notif.type)}</View>
              <View style={styles.textContainer}>
                <Text style={styles.title}>{notif.title}</Text>
                <Text style={styles.message}>{notif.message}</Text>
                <Text style={styles.time}>{notif.time}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      <TouchableOpacity
        style={styles.clearButton}
        onPress={() => setNotifications([])}
      >
        <Ionicons name="trash-outline" size={22} color="white" />
        <Text style={styles.clearButtonText}>Clear All</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NotificationScreen;
