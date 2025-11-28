import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles/WaterConsumptionStyle";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Removed: LineChart and Dimensions imports
const BASE_URL = "https://aquameter-backend-8u1x.onrender.com";

const processConsumptionData = (data) => {
  if (data.length === 0) return { present: null, previous: null };

  const cleanedData = data.map((item) => ({
    ...item,
    consumption: Number(item.consumption) || 0,
    timestamp: new Date(item.timestamp),
  }));

  // Sort by timestamp just in case the API doesn't guarantee order
  cleanedData.sort((a, b) => a.timestamp - b.timestamp);

  const totalConsumption = cleanedData.reduce((sum, item) => sum + item.consumption, 0);
  const avg = (totalConsumption / cleanedData.length).toFixed(1);
  const avgText = `${avg} cu.m.`;

  const last = cleanedData[cleanedData.length - 1];
  const secondLast = cleanedData.length > 1 ? cleanedData[cleanedData.length - 2] : null;

  const formatReading = (reading) => ({
    month: reading.timestamp.toLocaleString("default", { month: "long" }),
    year: reading.timestamp.getFullYear(),
    consumption: `${reading.consumption} cu.m.`,
    average: avgText,
    raw: reading,
  });

  return {
    present: formatReading(last),
    previous: secondLast ? formatReading(secondLast) : null,
  };
};


const WaterConsumption = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [present, setPresent] = useState(null);
  const [previous, setPrevious] = useState(null);

  const fetchConsumption = useCallback(async () => {
    try {
      setLoading(true);

      const storedUser = await AsyncStorage.getItem("user");
      const token = await AsyncStorage.getItem("token");

      if (!storedUser || !token) {
        Alert.alert("Authentication Error", "Please log in again.");
        return navigation.navigate("LoginScreen");
      }

      const { user_id } = JSON.parse(storedUser);

      const response = await fetch(`${BASE_URL}/water/readings/${user_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return Alert.alert("Error", data.message || "Failed to load data.");
      }

      const processed = processConsumptionData(data.data);

      // Update states with processed data
      setPresent(processed.present);
      setPrevious(processed.previous);

    } catch (err) {
      console.error("❌ Error fetching consumption:", err);
      Alert.alert("Error", "Unable to fetch consumption data.");
    } finally {
      setLoading(false);
    }
  }, [navigation]);

  useEffect(() => {
    fetchConsumption();
  }, [fetchConsumption]);


  const renderConsumptionDetails = (cons) => (
    // Note: The detailsContainer style now uses the new card-interior style
    <View style={styles.detailsContainer}>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Period</Text>
        <Text style={styles.detailValue}>
          {cons.month} {cons.year}
        </Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Consumption</Text>
        <Text style={styles.detailValue}>{cons.consumption}</Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Average</Text>
        <Text style={styles.detailValue}>{cons.average}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#1D3B66" />
        <Text style={{ color: '#1D3B66', marginTop: 10 }}>Loading consumption data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 💧 HEADER: Elevated card-like header for better separation */}
      <View style={styles.backHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Water Consumption</Text>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        {present && (
          // Present Card (Primary Dark Blue)
          <View style={[styles.card, styles.presentCard]}>
            <Text style={styles.cardText}>Present Water Consumption</Text>
            {renderConsumptionDetails(present)}
          </View>
        )}

        {previous && (
          // Previous Card (Secondary Light Blue)
          <View style={[styles.card, styles.previousCard]}>
            <Text style={styles.cardText}>Previous Water Consumption</Text>
            {renderConsumptionDetails(previous)}
          </View>
        )}

        {!present && !previous && (
          <View style={[styles.card, styles.placeholderCard]}>
            <Ionicons name="water-outline" size={40} color="#1D3B66" style={{ marginBottom: 10 }} />
            <Text style={styles.cardTextPlaceholder}>No consumption data found.</Text>
          </View>
        )}
      </ScrollView>

      {/* 🧭 FOOTER: Styled for better visual separation and modern icons */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerIcon}
          onPress={() => navigation.navigate("TrendLineScreen")}
        >
          {/* Outline icon for inactive screen */}
          <Ionicons name="stats-chart-outline" size={28} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerIcon}
          onPress={() => navigation.navigate("HomeScreen")}
        >
          {/* Outline icon for inactive screen */}
          <Ionicons name="home-outline" size={28} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerIcon}
          onPress={() => navigation.navigate("ProfileScreen")}
        >
          {/* Outline icon for inactive screen */}
          <Ionicons name="person-outline" size={28} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WaterConsumption;