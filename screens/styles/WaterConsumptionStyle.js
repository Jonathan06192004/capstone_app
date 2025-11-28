import { StyleSheet, Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EDEDED", // Light grey background
  },

  // ========================
  // 💧 HEADER STYLE (MATCHES TRENDLINE)
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
    color: "#fff",
    fontSize: 22, // Slightly larger
    fontWeight: "bold",
    marginLeft: 15,
  },

  body: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "flex-start",
    alignItems: "center",
  },

  // ========================
  // 💳 CARD STYLES (MATCHES TRENDLINE)
  // ========================
  card: {
    width: screenWidth * 0.9, // Fixed width to match TrendLine chart card
    paddingVertical: 30, // Increased vertical padding
    borderRadius: 16, // Pronounced rounding
    marginVertical: 15,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    overflow: "hidden",
    // Elevated and distinct shadow for the main content
    shadowColor: "#1D3B66",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 7.49,
    elevation: 10,
  },
  
  // Present Card uses the primary dark blue
  presentCard: {
    backgroundColor: "#1D3B66", 
  },

  // Previous Card uses the secondary light blue
  previousCard: {
    backgroundColor: "#7BAFD4", 
  },
  
  placeholderCard: {
    backgroundColor: "#C2E6F5",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },

  cardText: {
    color: "#fff", 
    fontSize: 20, // Slightly larger title
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 10,
  },
  
  cardTextPlaceholder: {
    color: "#1D3B66",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },

  // ========= DETAIL TEXT STYLE (Cleaned up inner details) =========
  detailsContainer: {
    width: "100%",
    marginTop: 15,
    padding: 16, // Increased padding
    // Semi-transparent overlay to visually separate details from the card background
    backgroundColor: 'rgba(255, 255, 255, 0.15)', 
    borderRadius: 12, // Inner rounded corners
  },

  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)', // Faint white separator
    paddingBottom: 8,
    marginBottom: 8,
  },

  detailLabel: {
    color: "#fff",
    fontWeight: "600", 
    fontSize: 15,
    flex: 0.7,
  },

  detailValue: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700", // Make values bolder
    textAlign: "right",
    flex: 1.2,
    flexWrap: 'wrap',
  },

  // Remove the border on the last row for cleaner look
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  
  // ========================
  // 🧭 FOOTER STYLE (MATCHES TRENDLINE)
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