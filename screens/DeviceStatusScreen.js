// screens/DeviceStatusScreen.js
import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    ActivityIndicator,
    ScrollView,
    Alert,
    TouchableOpacity
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';

import { styles as homeStyles } from './styles/HomeScreenStyle.js';
import { styles as statusStyles } from './styles/DeviceStatusScreenStyle.js';

const API_BASE_URL = "https://aquameter-backend-8u1x.onrender.com";

// ✅ Raspberry Pi MJPEG Stream
const RASPI_STREAM_URL = "http://192.168.254.114:8000/stream.mjpeg";

const DeviceStatusScreen = ({ navigation }) => {
    const route = useRoute();
    const { user_id: userId, token } = route.params;

    const [deviceStatus, setDeviceStatus] = useState(null);
    const [deviceInfo, setDeviceInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // --- Navigation ---
    const navigateToProfile = () => {
        navigation.navigate("ProfileScreen", { user_id: userId, token });
    };

    const navigateToHome = () => {
        navigation.navigate("HomeScreen", { user_id: userId, token });
    };

    // --- Fetch Device Status ---
    const fetchDeviceStatus = async () => {
        if (!userId) {
            setIsLoading(false);
            return;
        }

        try {
            const headers = {};
            if (token) headers.Authorization = `Bearer ${token}`;

            const res = await fetch(`${API_BASE_URL}/device/${userId}`, {
                method: "GET",
                headers,
            });

            const data = await res.json();

            if (data.success && Array.isArray(data.devices) && data.devices.length > 0) {
                const device = data.devices[0];
                setDeviceInfo(device);
                setDeviceStatus(device.device_status || null);
            } else {
                setDeviceInfo(null);
                setDeviceStatus(null);
            }
        } catch (err) {
            console.error("fetchDeviceStatus error:", err);
            Alert.alert("Error", "Unable to fetch device status.");
            setDeviceInfo(null);
            setDeviceStatus(null);
        } finally {
            setIsLoading(false);
        }
    };

    // --- Polling ---
    useEffect(() => {
        let interval;
        let isActive = true;

        fetchDeviceStatus();

        if (userId && token) {
            interval = setInterval(() => {
                if (isActive) fetchDeviceStatus();
            }, 10000);
        }

        return () => {
            isActive = false;
            clearInterval(interval);
        };
    }, [userId, token]);

    const statusText = deviceStatus === "Active" ? "Online" : "Offline";
    const statusColor = deviceStatus === "Active" ? '#4CAF50' : '#F44336';
    const statusIcon = deviceStatus === "Active" ? "cloud-done" : "cloud-offline";

    // --- Render Status ---
    const renderDeviceStatus = () => {
        if (isLoading) {
            return (
                <View style={statusStyles.statusContainer}>
                    <ActivityIndicator size="large" />
                    <Text style={statusStyles.loadingText}>Fetching Device Status...</Text>
                </View>
            );
        }

        if (!deviceInfo) {
            return (
                <View style={statusStyles.statusContainer}>
                    <Ionicons name="alert-circle-outline" size={60} color="#999" />
                    <Text style={statusStyles.mainStatusText}>No Device Connected</Text>
                    <Text style={statusStyles.detailText}>
                        Please register your water meter device.
                    </Text>
                </View>
            );
        }

        return (
            <View style={statusStyles.statusContainer}>

                {/* ✅ LIVE CAMERA STREAM */}
                <View style={statusStyles.cameraViewWrapper}>
                    <WebView
                        source={{ uri: RASPI_STREAM_URL }}
                        style={statusStyles.cameraView}
                        javaScriptEnabled
                        domStorageEnabled
                        allowsInlineMediaPlayback
                        mediaPlaybackRequiresUserAction={false}
                    />
                </View>

                {/* Status */}
                <Ionicons name={statusIcon} size={80} color={statusColor} />
                <Text style={[statusStyles.mainStatusText, { color: statusColor }]}>
                    {statusText}
                </Text>

                <Text style={statusStyles.detailText}>
                    The device is currently {statusText.toLowerCase()}.
                </Text>

                {/* Device Info */}
                <View style={statusStyles.deviceDetails}>
                    <Text style={statusStyles.detailHeader}>Device Information</Text>

                    <Text style={statusStyles.detailItem}>
                        <Text style={statusStyles.detailLabel}>Serial:</Text>{' '}
                        {deviceInfo.device_serial || 'N/A'}
                    </Text>

                    <Text style={statusStyles.detailItem}>
                        <Text style={statusStyles.detailLabel}>Location:</Text>{' '}
                        {deviceInfo.location || 'N/A'}
                    </Text>

                    <Text style={statusStyles.detailItem}>
                        <Text style={statusStyles.detailLabel}>Last Updated:</Text>{' '}
                        {new Date().toLocaleTimeString()}
                    </Text>
                </View>

                <Text style={statusStyles.detailTextSmall}>
                    Status refreshes every 10 seconds. Camera feed is near real-time.
                </Text>
            </View>
        );
    };

    return (
        <View style={homeStyles.container}>
            {/* Header */}
            <View style={homeStyles.header}>
                <TouchableOpacity style={homeStyles.headerLeft}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 15 }}>
                        <Ionicons name="arrow-back" size={28} color="#fff" />
                    </TouchableOpacity>
                    <Text style={homeStyles.greeting}>Device Status</Text>
                </TouchableOpacity>
            </View>

            {/* Content */}
            <ScrollView style={homeStyles.scrollView} showsVerticalScrollIndicator={false}>
                <Text style={[homeStyles.sectionTitleDashboard, { marginBottom: 20 }]}>
                    Live Connection
                </Text>

                {renderDeviceStatus()}

                <View style={{ height: 60 }} />
            </ScrollView>

            {/* Footer */}
            <View style={homeStyles.footer}>
                <TouchableOpacity
                    style={homeStyles.footerIcon}
                    onPress={() => navigation.navigate("TrendLineScreen", { user_id: userId })}
                >
                    <Ionicons name="stats-chart-outline" size={28} color="#666" />
                </TouchableOpacity>

                <TouchableOpacity style={homeStyles.footerIcon} onPress={navigateToHome}>
                    <View style={homeStyles.activeIconWrapper}>
                        <Ionicons name="home-sharp" size={28} color="#1E3D6B" />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={homeStyles.footerIcon} onPress={navigateToProfile}>
                    <Ionicons name="person-outline" size={28} color="#666" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default DeviceStatusScreen;
