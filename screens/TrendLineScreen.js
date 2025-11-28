import React, { useState, useEffect, useCallback } from "react";
import {
 View,
 Text,
 TouchableOpacity,
 ScrollView,
 Dimensions,
 ActivityIndicator,
 Alert,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "./styles/TrendLineScreenStyle"; 

const screenWidth = Dimensions.get("window").width;
const BASE_URL = "https://aquameter-backend-8u1x.onrender.com";

const initialChartData = {
 labels: [],
 datasets: [{ data: [] }],
};

// Helper function to map fetched data to LineChart format (UNCHANGED)
const mapDataForChart = (data) => {
 if (!data || data.length === 0) return initialChartData;

 const labels = data.map(item => item.label);
 const consumptionData = data.map(item => Number(item.consumption_sum) || 0);

 return {
  labels: labels,
  datasets: [{ data: consumptionData }],
 };
};

function TrendLineScreen({ navigation }) {
 const [selectedRange, setSelectedRange] = useState("monthly");
 const [chartData, setChartData] = useState(initialChartData);
 const [loading, setLoading] = useState(true);

 const isDataReady =
  chartData.labels.length > 0 &&
  chartData.datasets.length > 0 &&
  chartData.datasets[0].data.length > 0;

 // Dynamic chart width calculation based on the number of labels
 const getChartWidth = (range, dataCount) => {
    const baseWidth = screenWidth * 0.9;
    const padding = 40; 
    const contentWidth = baseWidth - padding;

    // Standardizing the space per point for a consistent feel
    let multiplier;

    if (range === 'weekly') {
        // Weekly (7 points) - Multiplier 70 (UNCHANGED)
        multiplier = 70; 
    } else if (range === 'monthly') {
        // 🔥 MODIFIED: Increased multiplier to 50 for much more horizontal space (approx 1500px total width)
        multiplier = 50; 
    } else if (range === 'yearly') {
        // Yearly (12 points) - Multiplier 70 (UNCHANGED)
        multiplier = 70;
    }
    
    // Ensure the chart is at least the screen width (contentWidth), otherwise apply the calculated width
    return Math.max(contentWidth, dataCount * multiplier);
 };

 const chartWidth = getChartWidth(selectedRange, chartData.labels.length);

 // Chart Height Increased for better visibility (UNCHANGED)
 const chartHeight = 350; 


 const loadTrendData = useCallback(async (range) => {
  setLoading(true);

  try {
    const storedUser = await AsyncStorage.getItem("user");
    const token = await AsyncStorage.getItem("token");

    if (!storedUser || !token) {
    setChartData(initialChartData);
    navigation.navigate("LoginScreen");
    return;
    }

    const { user_id } = JSON.parse(storedUser);

    const response = await fetch(
    `${BASE_URL}/water/trend/${user_id}?range=${range}`,
    {
    headers: { Authorization: `Bearer ${token}` },
    }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
    Alert.alert("Error", data.message || "Failed to load trend data.");
    setChartData(initialChartData);
    return;
    }

    const newChartData = mapDataForChart(data.data);
    setChartData(newChartData);

  } catch (err) {
    console.error("❌ Error fetching trend data:", err);
    Alert.alert("Error", "Unable to fetch water trend data.");
    setChartData(initialChartData);
  } finally {
    setLoading(false);
  }
 }, [navigation]);

 useEffect(() => {
  loadTrendData(selectedRange);
 }, [selectedRange, loadTrendData]);


 const renderChart = () => {
    if (loading) {
        return (
            <View style={styles.chartPlaceholder}>
                <ActivityIndicator size="large" color="#1D3B66" />
                <Text style={{ color: '#1D3B66', marginTop: 10 }}>Loading trend data...</Text>
            </View>
        );
    }

    if (!isDataReady) {
        return (
            <View style={styles.chartPlaceholder}>
                <Ionicons name="water-outline" size={50} color="#1D3B66" />
                <Text style={{ color: '#1D3B66', marginTop: 10, fontSize: 16, textAlign: 'center' }}>
                    No consumption data available for this range.
                </Text>
            </View>
        );
    }

    // Determine label rotation based on range (UNCHANGED)
    const rotation = selectedRange === 'monthly' ? 45 : 0; 
    
    // isScrollable is TRUE for ALL ranges to enforce consistent space/swiping
    const isScrollable = true; 


    const chartComponent = (
        <LineChart
            data={chartData}
            width={chartWidth} // Dynamic width
            height={chartHeight} // Increased height
            chartConfig={{
                backgroundGradientFrom: "#1D3B66",
                backgroundGradientTo: "#7BAFD4",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                propsForDots: {
                    r: "4", 
                    strokeWidth: "2",
                    stroke: "#C2E6F5", 
                    fill: '#1D3B66',
                },
                propsForBackgroundLines: {
                    strokeDasharray: "",
                    stroke: 'rgba(255, 255, 255, 0.2)',
                },
                // formatXLabel is crucial for monthly labels
                formatXLabel: (label) => {
                    // Truncate labels for monthly to avoid overlap, but keep them
                    if (selectedRange === 'monthly' && label.length > 2) {
                        return label.substring(0, 2);
                    }
                    return label;
                },
            }}
            bezier
            withVerticalLabels={true}
            withHorizontalLabels={true}
            // Increase font size slightly for better visibility
            style={{...styles.lineChartStyle, fontSize: 10, labelRotation: rotation}} 
        />
    );

    // This always returns the ScrollView wrapper
    if (isScrollable) {
        return (
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={true} 
                contentContainerStyle={styles.scrollableChartContainer}
            >
                {chartComponent}
            </ScrollView>
        );
    }

    // This block is no longer reachable, but kept for completeness
    return chartComponent;
 };


 return (
  <View style={styles.container}>
    {/* 💧 HEADER: Elevated card-like header for better separation */}
    <View style={styles.backHeader}>
    <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={26} color="#fff" />
    </TouchableOpacity>
    <Text style={styles.headerText}>Water Trend Analysis</Text>
    </View>

    <ScrollView
    showsVerticalScrollIndicator={false}
    contentContainerStyle={styles.scrollBody}
    >
    {/* RANGE BUTTONS: Styled as a segmented control with rounded corners and elevation */}
    <View style={styles.rangeContainer}>
        {["weekly", "monthly", "yearly"].map((range) => (
        <TouchableOpacity
            key={range}
            style={[
            styles.rangeButton,
            selectedRange === range && styles.rangeButtonActive,
            ]}
            onPress={() => setSelectedRange(range)}
            disabled={loading}
        >
            <Text
            style={[
                styles.rangeButtonText,
                selectedRange === range && styles.rangeButtonTextActive,
            ]}
            >
            {range.charAt(0).toUpperCase() + range.slice(1)}
            </Text>
        </TouchableOpacity>
        ))}
    </View>

    {/* GRAPH: Encased in an elegant card with shadow and title */}
    <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>
        Consumption
        </Text>
        <View style={styles.chartWrapper}>
            {renderChart()}
        </View>
    </View>
    </ScrollView>

    {/* 🧭 FOOTER: Styled for better visual separation */}
    <View style={styles.footer}>
    {/* 👇 ACTIVE ICON WRAPPER APPLIED HERE */}
    <TouchableOpacity style={styles.footerIcon} onPress={() => { /* Current screen, no navigation needed */ }}>
        <View style={styles.activeIconWrapper}>
        {/* Icon color is white for contrast */}
        <Ionicons name="stats-chart" size={28} color="#fff" /> 
        </View>
    </TouchableOpacity>

    <TouchableOpacity
        style={styles.footerIcon}
        onPress={() => navigation.navigate("HomeScreen")}>
        <Ionicons name="home-outline" size={28} color="#000" /> 
    </TouchableOpacity>

    <TouchableOpacity
        style={styles.footerIcon}
        onPress={() => navigation.navigate("ProfileScreen")}>
        <Ionicons name="person-outline" size={28} color="#000" /> 
    </TouchableOpacity>
    </View>
  </View>
 );
}

export default TrendLineScreen;