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

// Use Raspberry Pi's local IP here
const PI_LOCAL_URL = "http://10.171.59.173:8000";

const DeviceStatusScreen = ({ navigation }) => {
    const route = useRoute();
    const { user_id: userId, token } = route.params;

    const [deviceStatus, setDeviceStatus] = useState(null);
    const [deviceInfo, setDeviceInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const [latestReading, setLatestReading] = useState(null);
    const [readingTime, setReadingTime] = useState(null);

    const [streamUrl, setStreamUrl] = useState(`${PI_LOCAL_URL}/stream.mjpeg`);

    const navigateToProfile = () => navigation.navigate("ProfileScreen", { user_id: userId, token });
    const navigateToHome = () => navigation.navigate("HomeScreen", { user_id: userId, token });

    // -------------------------
    // Fetch Device Status / Latest Reading
    // -------------------------
    const fetchDeviceStatus = async () => {
        if (!userId) return;
        try {
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const res = await fetch(`${API_BASE_URL}/device/${userId}`, { headers });
            const data = await res.json();
            if (data.success && data.devices?.length > 0) {
                const device = data.devices[0];
                setDeviceInfo(device);
                setDeviceStatus(device.device_status || null);
            } else {
                setDeviceInfo(null);
                setDeviceStatus(null);
            }
        } catch (err) { 
            console.error(err); 
            setDeviceInfo(null); 
            setDeviceStatus(null); 
        } finally { 
            setIsLoading(false); 
        }
    };

    const fetchLatestReading = async () => {
        if (!userId || !token) return;
        try {
            const res = await fetch(`${API_BASE_URL}/water/latest-reading/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success && data.data) {
                setLatestReading(data.data.reading_5digit);
                setReadingTime(data.data.timestamp);
            }
        } catch (err) { console.error(err); }
    };

    // -------------------------
    // Initial fetch and interval
    // -------------------------
    useEffect(() => {
        fetchDeviceStatus();
        fetchLatestReading();

        const interval = setInterval(() => {
            fetchDeviceStatus();
            fetchLatestReading();
        }, 10000); // every 10s

        return () => clearInterval(interval);
    }, [userId, token]);

    const statusText = deviceStatus === "Active" ? "Online" : "Offline";
    const statusColor = deviceStatus === "Active" ? '#4CAF50' : '#F44336';
    const statusIcon = deviceStatus === "Active" ? "cloud-done" : "cloud-offline";

    const renderDeviceStatus = () => {
        if (isLoading) return (
            <View style={statusStyles.statusContainer}>
                <ActivityIndicator size="large" />
                <Text style={statusStyles.loadingText}>Fetching Device Status...</Text>
            </View>
        );
        if (!deviceInfo) return (
            <View style={statusStyles.statusContainer}>
                <Ionicons name="alert-circle-outline" size={60} color="#999" />
                <Text style={statusStyles.mainStatusText}>No Device Connected</Text>
                <Text style={statusStyles.detailText}>Please register your water meter device.</Text>
            </View>
        );

        return (
            <View style={statusStyles.statusContainer}>
                <View style={statusStyles.cameraViewWrapper}>
                    {streamUrl ? (
                        <WebView
                            source={{ uri: streamUrl }}
                            style={statusStyles.cameraView}
                            javaScriptEnabled
                            domStorageEnabled
                            allowsInlineMediaPlayback
                            mediaPlaybackRequiresUserAction={false}
                            mixedContentMode="always"
                            originWhitelist={['*']}
                            onError={() => Alert.alert("Camera Offline","Unable to connect to camera stream.")}
                        />
                    ) : (
                        <Text style={statusStyles.detailText}>Fetching camera stream...</Text>
                    )}
                </View>

                <View style={statusStyles.readingBox}>
                    <Text style={statusStyles.readingLabel}>Latest Meter Reading</Text>
                    <Text style={statusStyles.readingValue}>{latestReading ?? "--"}</Text>
                    {readingTime && (
                        <Text style={statusStyles.readingTime}>
                            Updated: {new Date(readingTime).toLocaleString()}
                        </Text>
                    )}
                </View>

                <Ionicons name={statusIcon} size={80} color={statusColor} />
                <Text style={[statusStyles.mainStatusText, { color: statusColor }]}>{statusText}</Text>
                <Text style={statusStyles.detailText}>The device is currently {statusText.toLowerCase()}.</Text>

                <View style={statusStyles.deviceDetails}>
                    <Text style={statusStyles.detailHeader}>Device Information</Text>
                    <Text style={statusStyles.detailItem}>
                        <Text style={statusStyles.detailLabel}>Serial:</Text> {deviceInfo.device_serial || 'N/A'}
                    </Text>
                    <Text style={statusStyles.detailItem}>
                        <Text style={statusStyles.detailLabel}>Location:</Text> {deviceInfo.location || 'N/A'}
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
            <View style={homeStyles.header}>
                <TouchableOpacity style={homeStyles.headerLeft}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 15 }}>
                        <Ionicons name="arrow-back" size={28} color="#fff" />
                    </TouchableOpacity>
                    <Text style={homeStyles.greeting}>Device Status</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={homeStyles.scrollView} showsVerticalScrollIndicator={false}>
                <Text style={[homeStyles.sectionTitleDashboard, { marginBottom: 20 }]}>Live Connection</Text>
                {renderDeviceStatus()}
                <View style={{ height: 60 }} />
            </ScrollView>

            <View style={homeStyles.footer}>
                <TouchableOpacity style={homeStyles.footerIcon} onPress={() => navigation.navigate("TrendLineScreen", { user_id: userId })}>
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
