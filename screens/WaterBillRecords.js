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
// --- CORRECTED STYLE IMPORT ---
// We only import the single merged style file now.
import { styles } from "./styles/WaterBillRecordsStyle";
// The two problematic imports below are removed:
// import { headerFooterStyles } from "./styles/AppHeaderFooterStyle"; 
// import { detailTableStyles } from "./styles/BillDetailTableStyle";
// ------------------------------
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "https://aquameter-backend-8u1x.onrender.com";

// --- Data Processing Function (No Change) ---
const processBillData = (data) => {
if (data.length === 0) return { present: null, previous: null, history: [] };

const formatBill = (bill) => {
 const periodEndDate = new Date(bill.period_end);
   
 return {
  period: periodEndDate.toLocaleString("default", { month: "long", year: "numeric" }),
  periodRange: `${new Date(bill.period_start).toLocaleDateString()} - ${periodEndDate.toLocaleDateString()}`,
  due_date: new Date(bill.due_date).toLocaleDateString(),
  consumption: `${bill.total_consumption.toFixed(1)} cu.m.`,
  amount: `₱${bill.amount_to_pay.toFixed(2)}`,
  bill_id: bill.bill_id,
  raw: bill,
 };
};

const formatHistoryItem = (bill) => ({
 period: new Date(bill.period_end).toLocaleString("default", { month: "short", year: "numeric" }),
 consumption: bill.total_consumption.toFixed(1),
 amount: bill.amount_to_pay.toFixed(2),
});

// CORE LOGIC: Assign based on index (newest first)
const presentBill = data[0];
const previousBill = data.length > 1 ? data[1] : null;
const historyBills = data.slice(2);

return {
 present: presentBill ? formatBill(presentBill) : null,
 previous: previousBill ? formatBill(previousBill) : null,
 history: historyBills.map(formatHistoryItem),
};
};


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
    return navigation.navigate("LoginScreen");
   }

   const { user_id } = JSON.parse(storedUser);

   const response = await fetch(`${BASE_URL}/water/bill/${user_id}`, {
    headers: { Authorization: `Bearer ${storedToken}` },
   });

   const data = await response.json();

   if (response.ok && data.success && Array.isArray(data.data) && data.data.length > 0) {
    
    const processed = processBillData(data.data);

    setPresentBill(processed.present);
    setPreviousBill(processed.previous);
    setHistoryBills(processed.history);

   } else {
    setPresentBill(null);
    setPreviousBill(null);
    setHistoryBills([]);

    if (!response.ok || !data.success) {
     Alert.alert("Error", data.message || "Failed to communicate with server.");
    }
   }
  } catch (error) {
   console.error("❌ Error fetching bills:", error);
   Alert.alert("Error", "Unable to fetch water bills.");
  } finally {
   setLoading(false);
  }
 };

 fetchBills();
}, [navigation]);

const toggleHistory = () => setShowHistory(!showHistory);

// --- MODIFIED: Uses 'styles' (merged) properties directly ---
const renderBillDetails = (bill) => (
 <View style={styles.detailsContainer}>
  <View style={styles.detailRow}>
   <Text style={styles.detailLabel}>Period</Text>
   <Text style={styles.detailValue}>{bill.period}</Text>
  </View>
  <View style={styles.detailRow}>
   <Text style={styles.detailLabel}>Billing Range:</Text>
   <Text style={styles.detailValue}>
    {bill.periodRange}
   </Text>
  </View>
  <View style={styles.detailRow}>
   <Text style={styles.detailLabel}>Due Date:</Text>
   <Text style={styles.detailValue}>
    {bill.due_date}
   </Text>
  </View>
  <View style={styles.detailRow}>
   <Text style={styles.detailLabel}>Consumption:</Text>
   <Text style={styles.detailValue}>{bill.consumption}</Text>
  </View>
  <View style={[styles.detailRow, { borderBottomWidth: 0, paddingBottom: 0, marginBottom: 0, marginTop: 10 }]}>
   <Text style={styles.detailLabel}>Total Amount Due:</Text>
   <Text style={styles.totalPrice}>{bill.amount}</Text>
  </View>
 </View>
);

// --- MODIFIED: Uses 'styles' (merged) properties directly ---
const renderHistoryTable = () => (
 <View style={styles.historyTableContainer}>
  <View style={styles.tableHeader}>
   <Text style={[styles.tableHeaderText, styles.tableHeaderPeriod]}>
    Period
   </Text>
   <Text
    style={[styles.tableHeaderText, styles.tableHeaderConsumption]}
   >
    Cons. (cu.m.)
   </Text>
   <Text style={[styles.tableHeaderText, styles.tableHeaderAmount]}>
    Total (₱)
   </Text>
  </View>

  {historyBills.map((bill, index) => (
   <View key={index} style={styles.tableRow}>
    <Text style={[styles.tableCell, styles.tableCellPeriod]}>
     {bill.period}
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
     ₱{bill.amount}
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
  {/* HEADER: Uses 'styles' properties directly */}
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
    null
   )}

   {previousBill && (
    <View style={[styles.card, styles.previousBillCard]}>
     <Text style={styles.cardText}>Previous Water Bill</Text>
     {renderBillDetails(previousBill)}
    </View>
   )}
     
   {!presentBill && !previousBill && historyBills.length === 0 && (
    <View style={[styles.card, styles.placeholderCard, { marginTop: 20 }]}>
     <Ionicons name="receipt-outline" size={40} color="#1D3B66" style={{ marginBottom: 10 }} />
     <Text style={styles.cardTextPlaceholder}>No bill records found.</Text>
    </View>
   )}

   {historyBills.length > 0 && (
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

  {/* FOOTER: Uses 'styles' properties directly */}
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