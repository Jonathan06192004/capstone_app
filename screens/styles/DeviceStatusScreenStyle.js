// screens/styles/DeviceStatusScreenStyle.js
import { StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

export const styles = StyleSheet.create({
    // --- STATUS CARD STYLES (Unchanged) ---
    screenTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1E3D6B',
        marginBottom: 20,
        textAlign: 'center',
    },
    statusContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 20,
        marginHorizontal: 15, 
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#1E3D6B',
    },
    loadingColor: { 
        color: '#1E3D6B',
    },
    noDeviceColor: { 
        color: '#FF9800',
    },
    mainStatusText: {
        fontSize: 32,
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 10,
    },
    detailText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
    detailTextSmall: {
        fontSize: 12,
        color: '#999',
        marginTop: 15,
    },
    deviceDetails: {
        width: '100%',
        padding: 15,
        backgroundColor: '#F9F9F9',
        borderRadius: 10,
        borderLeftWidth: 5,
        borderLeftColor: '#1E3D6B',
    },
    detailHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1E3D6B',
        marginBottom: 10,
    },
    detailItem: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
    },
    detailLabel: {
        fontWeight: 'bold',
        color: '#000',
    },
    
    // 💡 NEW STYLES FOR THE CAMERA VIEW
    cameraViewWrapper: {
        width: '100%',
        aspectRatio: 640 / 480, // Match the camera aspect ratio (640x480)
        borderRadius: 10,
        overflow: 'hidden', 
        marginBottom: 20,
        backgroundColor: '#000', // Black background while loading stream
        borderWidth: 2,
        borderColor: '#1E3D6B'
    },
    cameraView: {
        width: '100%',
        height: '100%',
    },
});