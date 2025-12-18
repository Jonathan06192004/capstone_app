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

const BASE_URL = "https://aquameter-backend-8u1x.onrender.com";

/**
 * ==================================================
 * UPDATED LOGIC (ROW-BASED, DESIGN PRESERVED)
 * ==================================================
 */
const processConsumptionData = (data) => {
  if (!data || data.length === 0) {
    return { present: null, previous: null, history: [] };
  }

  const totalConsumption = data.reduce(
    (sum, item) => sum + (item.consumption || 0),
    0
  );
  const avg =
    data.length > 0 ? (totalConsumption / data.length).toFixed(1) : "0.0";
  const avgText = `${avg} cu.m.`;

  const formatReading = (item) => {
    const date = new Date(item.timestamp);
    return {
      month: date.toLocaleString("default", { month: "long" }),
      year: date.getFullYear(),
      consumption: `${(item.consumption || 0).toFixed(1)} cu.m.`,
      average: avgText,
      raw: item,
    };
  };

  const formatHistoryItem = (item) => {
    const date = new Date(item.timestamp);
    return {
      monthYear: `${date.toLocaleString("default", {
        month: "short",
      })} ${date.getFullYear()}`,
      consumptionValue: (item.consumption || 0).toFixed(1),
      overallAverage: avg,
    };
  };

  return {
    present: data[0] ? formatReading(data[0]) : null,
    previous: data[1] ? formatReading(data[1]) : null,
    history: data.slice(2).map(formatHistoryItem),
  };
};

const WaterConsumption = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [present, setPresent] = useState(null);
  const [previous, setPrevious] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const toggleHistory = () => setShowHistory(!showHistory);

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

      const response = await fetch(
        `${BASE_URL}/water/readings/${user_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        return Alert.alert(
          "Error",
          data.message || "Failed to load data."
        );
      }

      const processed = processConsumptionData(data.data);

      setPresent(processed.present);
      setPrevious(processed.previous);
      setHistory(processed.history);
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

  const renderHistoryTable = () => (
    <View style={styles.historyTableContainer}>
      <View style={styles.tableHeader}>
        <Text
          style={[styles.tableHeaderText, styles.tableHeaderPeriod]}
        >
          Period
        </Text>
        <Text
          style={[styles.tableHeaderText, styles.tableHeaderAverage]}
        >
          Average
        </Text>
        <Text
          style={[
            styles.tableHeaderText,
            styles.tableHeaderConsumption,
          ]}
        >
          Consumption
        </Text>
      </View>

      {history.map((item, index) => (
        <View key={index} style={styles.tableRow}>
          <Text
            style={[styles.tableCell, styles.tableCellPeriod]}
          >
            {item.monthYear}
          </Text>

          <Text
            style={[styles.tableCell, styles.tableCellAverage]}
          >
            {item.overallAverage}
          </Text>

          <Text
            style={[
              styles.tableCell,
              styles.tableCellConsumption,
              { fontWeight: "bold" },
            ]}
          >
            {item.consumptionValue}
          </Text>
        </View>
      ))}
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
        <Text style={{ color: "#1D3B66", marginTop: 10 }}>
          Loading consumption data...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.backHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Water Consumption</Text>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        {present && (
          <View style={[styles.card, styles.presentCard]}>
            <Text style={styles.cardText}>
              Present Water Consumption
            </Text>
            {renderConsumptionDetails(present)}
          </View>
        )}

        {previous && (
          <View style={[styles.card, styles.previousCard]}>
            <Text style={styles.cardText}>
              Previous Water Consumption
            </Text>
            {renderConsumptionDetails(previous)}
          </View>
        )}

        {history.length > 0 && (
          <TouchableOpacity
            style={[styles.card, styles.historyCard]}
            onPress={toggleHistory}
            activeOpacity={0.8}
          >
            <Text style={styles.cardTextHistory}>
              Consumption History {showHistory ? "▲" : "▼"}
            </Text>
            {showHistory && renderHistoryTable()}
          </TouchableOpacity>
        )}

        {!present && !previous && history.length === 0 && (
          <View style={[styles.card, styles.placeholderCard]}>
            <Ionicons
              name="water-outline"
              size={40}
              color="#1D3B66"
              style={{ marginBottom: 10 }}
            />
            <Text style={styles.cardTextPlaceholder}>
              No consumption data found.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* FOOTER */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerIcon}
          onPress={() => navigation.navigate("TrendLineScreen")}
        >
          <Ionicons
            name="stats-chart-outline"
            size={28}
            color="#000"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerIcon}
          onPress={() => navigation.navigate("HomeScreen")}
        >
          <Ionicons name="home-outline" size={28} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerIcon}
          onPress={() => navigation.navigate("ProfileScreen")}
        >
          <Ionicons
            name="person-outline"
            size={28}
            color="#000"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WaterConsumption;
