import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    /* =============================
       MAIN CONTAINER
    ============================== */
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

    /* =============================
       STATUS TEXT
    ============================== */
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
        textAlign: 'center',
    },

    /* =============================
       CAMERA STREAM
    ============================== */
    cameraViewWrapper: {
        width: '100%',
        aspectRatio: 640 / 480,
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 15,
        backgroundColor: '#000',
        borderWidth: 2,
        borderColor: '#1E3D6B',
    },

    cameraView: {
        width: '100%',
        height: '100%',
    },

    /* =============================
       LATEST READING
    ============================== */
    readingBox: {
        alignItems: 'center',
        marginBottom: 20,
    },

    readingLabel: {
        fontSize: 14,
        color: '#666',
    },

    readingValue: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#1E3D6B',
    },

    readingTime: {
        fontSize: 12,
        color: '#999',
        marginTop: 3,
    },

    /* =============================
       DEVICE DETAILS
    ============================== */
    deviceDetails: {
        width: '100%',
        padding: 15,
        backgroundColor: '#F9F9F9',
        borderRadius: 10,
        borderLeftWidth: 5,
        borderLeftColor: '#1E3D6B',
        marginTop: 10,
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
});
