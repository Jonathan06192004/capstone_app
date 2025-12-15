// screens/DeviceStatusScreen.js
import React, { useState, useEffect } from 'react';
import { Text, View, ActivityIndicator, ScrollView, Alert, TouchableOpacity, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { styles as homeStyles } from './styles/HomeScreenStyle.js'; 
import { styles as statusStyles } from './styles/DeviceStatusScreenStyle.js'; 

const API_BASE_URL = "https://aquameter-backend-8u1x.onrender.com";

// 💡 NEW: Configuration for the Raspberry Pi stream
// 🚨 IMPORTANT: Replace 'YOUR_RASPI_IP' with the actual local IP address of your Raspberry Pi (e.g., '192.168.1.10')
const RASPI_STREAM_URL = "http://YOUR_RASPI_IP:8000/stream.mjpeg"; 

const DeviceStatusScreen = ({ navigation }) => {
    const route = useRoute();
    const { user_id: userId, token } = route.params;

    const [deviceStatus, setDeviceStatus] = useState(null);
    const [deviceInfo, setDeviceInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Placeholder data needed for the header/footer
    const [firstName, setFirstName] = useState("User"); 
    const [profileImage, setProfileImage] = useState(null); 
    
    // --- Navigation Functions (Unchanged) ---
    const navigateToProfile = () => {
        navigation.navigate("ProfileScreen", { user_id: userId, token: token });
    };

    const navigateToHome = () => {
        navigation.navigate("HomeScreen", { user_id: userId, token: token });
    };

    // --- Device Status Fetching Logic (Unchanged) ---
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

            if (data.success && Array.isArray(data.devices)) {
                if (data.devices.length > 0) {
                    const device = data.devices[0];
                    setDeviceInfo(device);
                    setDeviceStatus(device.device_status || null);
                } else {
                    setDeviceInfo(null);
                    setDeviceStatus(null);
                }
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

    // --- Polling Logic (Unchanged) ---
    useEffect(() => {
        let interval = null;
        let isActive = true;

        const initialFetch = async () => {
             if (isActive) await fetchDeviceStatus();
        };

        initialFetch();

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

    // --- Render Components (MODIFIED) ---

    const renderDeviceStatus = () => {
        if (isLoading) {
            return (
                <View style={statusStyles.statusContainer}>
                    <ActivityIndicator size="large" color={statusStyles.loadingColor.color} />
                    <Text style={statusStyles.loadingText}>Fetching Device Status...</Text>
                </View>
            );
        }

        if (deviceInfo == null) {
            return (
                <View style={statusStyles.statusContainer}>
                    <Ionicons name="alert-circle-outline" size={60} color={statusStyles.noDeviceColor.color} />
                    <Text style={statusStyles.mainStatusText}>No Device Connected</Text>
                    <Text style={statusStyles.detailText}>Please register your water meter device to view status and usage.</Text>
                </View>
            );
        }

        return (
            <View style={statusStyles.statusContainer}>
                {/* 💡 LIVE CAMERA STREAM INTEGRATION */}
                <View style={statusStyles.cameraViewWrapper}> 
                    <Image
                        style={statusStyles.cameraView}
                        source={{ uri: RASPI_STREAM_URL }}
                        // NOTE: You can uncomment the following if you need to troubleshoot connection issues
                        // defaultSource={require('./path/to/placeholder.png')} // Optional placeholder image
                    />
                </View>

                {/* Status Icons and Text */}
                <Ionicons name={statusIcon} size={80} color={statusColor} />
                <Text style={[statusStyles.mainStatusText, { color: statusColor }]}>{statusText}</Text>
                <Text style={statusStyles.detailText}>
                    The device is currently {statusText.toLowerCase()}.
                </Text>

                {/* Device Details Block */}
                <View style={statusStyles.deviceDetails}>
                    <Text style={statusStyles.detailHeader}>Device Information</Text>
                    <Text style={statusStyles.detailItem}>
                        <Text style={statusStyles.detailLabel}>Serial Number:</Text> {deviceInfo.device_serial || 'N/A'}
                    </Text>
                    <Text style={statusStyles.detailItem}>
                        <Text style={statusStyles.detailLabel}>Location:</Text> {deviceInfo.location || 'N/A'}
                    </Text>
                    <Text style={statusStyles.detailItem}>
                        <Text style={statusStyles.detailLabel}>Last Updated:</Text> {new Date().toLocaleTimeString()}
                    </Text>
                </View>

                <Text style={statusStyles.detailTextSmall}>
                    Status refreshes automatically every 10 seconds. Camera feed is near real-time.
                </Text>
            </View>
        );
    };

    return (
        <View style={homeStyles.container}>
            {/* --- HEADER (Unchanged) --- */}
            <View style={homeStyles.header}>
                <TouchableOpacity style={homeStyles.headerLeft} onPress={navigateToProfile}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{marginRight: 15}}>
                        <Ionicons name="arrow-back" size={28} color="#fff" />
                    </TouchableOpacity>

                    <Text style={homeStyles.greeting}>Device Status</Text>
                </TouchableOpacity>
                <View style={{ width: 28 }} />
            </View>

            {/* --- MAIN CONTENT (Modified to include the stream) --- */}
            <ScrollView style={homeStyles.scrollView} showsVerticalScrollIndicator={false}>
                <Text style={[homeStyles.sectionTitleDashboard, {marginTop: 0, marginBottom: 20}]}>Live Connection</Text>
                
                {renderDeviceStatus()}
                
                <View style={{ height: 60 }} /> 
            </ScrollView>

            {/* --- FOOTER (Unchanged) --- */}
            <View style={homeStyles.footer}>
                <TouchableOpacity
                    style={homeStyles.footerIcon}
                    onPress={() => navigation.navigate("TrendLineScreen", { user_id: userId })}
                >
                    <Ionicons name="stats-chart-outline" size={28} color="#666" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={homeStyles.footerIcon}
                    onPress={navigateToHome}
                >
                    <View style={homeStyles.activeIconWrapper}>
                        <Ionicons name="home-sharp" size={28} color="#1E3D6B" />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={homeStyles.footerIcon}
                    onPress={navigateToProfile}
                >
                    <Ionicons name="person-outline" size={28} color="#666" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default DeviceStatusScreen;