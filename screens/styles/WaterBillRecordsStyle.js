import { StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get("window").width;

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EDEDED', // Light grey background
    },

    // ========================
    // 💧 HEADER STYLE (MATCHES ALL SCREENS)
    // ========================
    backHeader: {
        backgroundColor: "#1D3B66", // Primary Dark Blue
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 20,
        paddingTop: 50,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        // Stronger shadow/elevation
        elevation: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5.46,
    },

    headerText: {
        color: '#fff',
        fontSize: 22, // Slightly larger
        fontWeight: 'bold',
        marginLeft: 15,
    },

    cardScrollView: {
        flexGrow: 1,
        padding: 20,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },

    // ========================
    // 💳 CARD STYLES (MATCHES ALL SCREENS)
    // ========================
    card: {
        width: screenWidth * 0.9, // Consistent width
        borderRadius: 16, // Pronounced rounding
        paddingVertical: 30, // Increased vertical padding
        alignItems: 'center',
        marginVertical: 15,
        paddingHorizontal: 20,
        overflow: 'hidden',
        // Elevated and distinct shadow
        shadowColor: "#1D3B66",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 7.49,
        elevation: 10,
    },

    // Present Bill: Keep the original color for distinction
    presentBillCard: {
        backgroundColor: '#1B3B6F', 
    },
    // Previous Bill: Keep the original color
    previousBillCard: {
        backgroundColor: '#6AAED9',
    },
    // History Card: Keep the original color
    historyCard: {
        backgroundColor: '#5A83A2',
    },
    
    placeholderCard: {
        backgroundColor: "#C2E6F5", // Lightest Blue for placeholder
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 4,
    },

    cardText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '800',
        marginBottom: 10,
    },

    cardTextPlaceholder: {
        color: "#1D3B66",
        fontSize: 18,
        fontWeight: "600",
        textAlign: "center",
    },

    // Inner Details Container
    detailsContainer: {
        width: '100%',
        marginTop: 15,
        padding: 16, // Increased padding
        // Semi-transparent overlay for separation
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 12,
    },

    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },

    detailLabel: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 15,
        flex: 0.8,
    },

    detailValue: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '700',
        textAlign: 'right',
        flex: 1.2,
        flexWrap: 'wrap',
    },

    totalPrice: {
        color: '#00E6FF', // Bright Cyan for emphasis
        fontWeight: '900',
        fontSize: 18, // Slightly larger total price
        textAlign: 'right',
        flex: 1.2,
    },

    // ========================
    // HISTORY TABLE STYLES
    // ========================
    historyTableContainer: {
        width: '100%',
        marginTop: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 10,
        padding: 10,
    },
    tableHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.4)',
        paddingBottom: 5,
    },
    tableHeaderText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
        textAlign: 'center',
    },
    tableHeaderPeriod: {
        flex: 1.4,
    },
    tableHeaderAmount: {
        flex: 1.2,
    },
    tableHeaderConsumption: {
        flex: 1.2,
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    tableCell: {
        color: '#fff',
        fontSize: 14,
        textAlign: 'center',
        paddingHorizontal: 5,
    },
    tableCellPeriod: {
        flex: 1.4,
    },
    tableCellAmount: {
        flex: 1.2,
    },
    tableCellConsumption: {
        flex: 1.2,
    },

    // ========================
    // 🧭 FOOTER STYLE (MATCHES ALL SCREENS)
    // ========================
    footer: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "#C2E6F5", // Lightest Blue
        paddingVertical: 15, // More padding
        borderTopLeftRadius: 25, // More rounded corners
        borderTopRightRadius: 25,
        // Distinctive, clean shadow
        elevation: 10,
        shadowColor: "#1D3B66",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        marginTop: "auto",
    },

    footerIcon: {
        flex: 1,
        alignItems: "center",
    },
});