import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles/WaterBillRecordsStyle";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "https://aquameter-backend-8u1x.onrender.com";
const screenWidth = Dimensions.get("window").width;

const WaterBillRecords = ({ navigation }) => {
  const [presentBill, setPresentBill] = useState(null);
  const [previousBill, setPreviousBill] = useState(null);
  const [historyBills, setHistoryBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        setLoading(true);

        const storedUser = await AsyncStorage.getItem("user");
        const storedToken = await AsyncStorage.getItem("token");

        if (!storedUser || !storedToken) {
          setLoading(false);
          return;
        }

        const { user_id } = JSON.parse(storedUser);

        // 🔥 FIX: Correct backend route
        const response = await fetch(`${BASE_URL}/water/bill/${user_id}`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (response.ok && data.success && Array.isArray(data.data)) {
          // Assuming data is sorted newest first
          setPresentBill(data.data[0] || null);
          setPreviousBill(data.data[1] || null);
          setHistoryBills(data.data.slice(2) || []);
        } else {
             Alert.alert("Error", data.message || "Failed to load bill data.");
        }
      } catch (error) {
        console.error("❌ Error fetching bills:", error);
        Alert.alert("Error", "Unable to fetch water bills.");
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, []);

  const toggleHistory = () => setShowHistory(!showHistory);

  const renderBillDetails = (bill) => (
    <View style={styles.detailsContainer}>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Bill Number:</Text>
        <Text style={styles.detailValue}>{bill.bill_id}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Billing Period:</Text>
        <Text style={styles.detailValue}>
          {new Date(bill.period_start).toLocaleDateString()} -{" "}
          {new Date(bill.period_end).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Due Date:</Text>
        <Text style={styles.detailValue}>
          {new Date(bill.due_date).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Consumption:</Text>
        <Text style={styles.detailValue}>{bill.consumption} cu.m.</Text>
      </View>
      {/* Total row with distinct color and font size */}
      <View style={[styles.detailRow, { borderBottomWidth: 0, paddingBottom: 0, marginBottom: 0, marginTop: 10 }]}>
        <Text style={styles.detailLabel}>Total Amount Due:</Text>
        <Text style={styles.totalPrice}>₱{bill.amount_to_pay.toFixed(2)}</Text>
      </View>
    </View>
  );

  const renderHistoryTable = () => (
    <View style={styles.historyTableContainer}>
      <View style={styles.tableHeader}>
        <Text style={[styles.tableHeaderText, styles.tableHeaderPeriod]}>
          Period
        </Text>
        <Text
          style={[styles.tableHeaderText, styles.tableHeaderConsumption]}
        >
          Cons.
        </Text>
        <Text style={[styles.tableHeaderText, styles.tableHeaderAmount]}>
          Total
        </Text>
      </View>

      {historyBills.map((bill, index) => (
        <View key={index} style={styles.tableRow}>
          <Text style={[styles.tableCell, styles.tableCellPeriod]}>
            {new Date(bill.period_end).toLocaleDateString()}
          </Text>

          <Text style={[styles.tableCell, styles.tableCellConsumption]}>
            {bill.consumption}
          </Text>

          <Text
            style={[
              styles.tableCell,
              styles.tableCellAmount,
              { color: "#00E6FF", fontWeight: "bold" },
            ]}
          >
            ₱{bill.amount_to_pay.toFixed(2)}
          </Text>
        </View>
      ))}
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#1D3B66" />
        <Text style={{ color: '#1D3B66', marginTop: 10 }}>Loading bill records...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER: Elevated card-like header */}
      <View style={styles.backHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Water Bill Records</Text>
      </View>

      <ScrollView contentContainerStyle={styles.cardScrollView}>
        {presentBill ? (
          <View style={[styles.card, styles.presentBillCard]}>
            <Text style={styles.cardText}>Latest Water Bill</Text>
            {renderBillDetails(presentBill)}
          </View>
        ) : (
          <View style={[styles.card, styles.placeholderCard]}>
            <Ionicons name="receipt-outline" size={40} color="#1D3B66" style={{ marginBottom: 10 }} />
            <Text style={styles.cardTextPlaceholder}>No present bill available.</Text>
          </View>
        )}

        {previousBill && (
          <View style={[styles.card, styles.previousBillCard]}>
            <Text style={styles.cardText}>Previous Water Bill</Text>
            {renderBillDetails(previousBill)}
          </View>
        )}

        {historyBills.length > 0 && (
          // History Card is a TouchableOpacity to allow expanding the history table
          <TouchableOpacity
            style={[styles.card, styles.historyCard]}
            onPress={toggleHistory}
            activeOpacity={0.8}
          >
            <Text style={styles.cardText}>
              Bill History {showHistory ? "▲" : "▼"}
            </Text>
            {showHistory && renderHistoryTable()}
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* FOOTER: Styled for consistency */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerIcon}
          onPress={() => navigation.navigate("TrendLineScreen")}
        >
          <Ionicons name="stats-chart-outline" size={28} color="#000" />
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
          <Ionicons name="person-outline" size={28} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WaterBillRecords;