import { StyleSheet, Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EDEDED", // Light grey background
  },

  // ========================
  // 💧 HEADER STYLE (Enhanced)
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
    // Stronger, more prominent shadow/elevation
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

  scrollBody: {
    paddingHorizontal: 20,
    paddingVertical: 15, // Increased vertical padding
    paddingBottom: 30,
    alignItems: 'center',
  },

  // ========================
  // 🔘 RANGE BUTTONS (Segmented Control look)
  // ========================
  rangeContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 15,
    backgroundColor: "#fff",
    borderRadius: 30, // Fully rounded capsule shape
    padding: 3,
    // Subtle shadow for lift
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2.22,
    width: screenWidth * 0.9, // Match card width
  },

  rangeButton: {
    flex: 1,
    paddingVertical: 12, // More padding
    paddingHorizontal: 16,
    borderRadius: 30, // Match container
    backgroundColor: "transparent",
    alignItems: 'center',
  },

  rangeButtonActive: {
    backgroundColor: "#7BAFD4", // Secondary Light Blue (Active Background)
    // Stronger active shadow
    shadowColor: "#1D3B66",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
  },

  rangeButtonText: {
    fontSize: 14,
    color: "#1D3B66", // Dark Blue (Inactive Text)
    fontWeight: "600", // Semi-bold for better readability
  },

  rangeButtonTextActive: {
    color: "#fff", // White (Active Text)
    fontWeight: "800", // Extra bold when active
  },

  // ========================
  // 📈 CHART CARD (New Container Style)
  // ========================
  chartCard: {
    width: screenWidth * 0.9,
    backgroundColor: "#fff",
    borderRadius: 16, // More pronounced rounding
    padding: 20, // Padding inside the card
    marginVertical: 10,
    // Elevated and distinct shadow for the main content
    shadowColor: "#1D3B66",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 7.49,
    elevation: 10,
  },

  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1D3B66",
    marginBottom: 15, // Space between title and chart
    textAlign: 'center',
  },

  chartWrapper: {
    // This wrapper is now mostly for centering the chart inside the card
    alignItems: "center",
    justifyContent: "center",
  },
  
  lineChartStyle: {
    // Apply the border radius directly to the chart to match the design
    borderRadius: 12, 
    // Margin here is to push it slightly from the padding if needed, but not strictly necessary with the 20px card padding
  },

  chartPlaceholder: {
    height: 280, 
    width: screenWidth * 0.9 - 40, // Match the chart width inside the card
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: "#C2E6F5", // Use the lightest blue for the placeholder background
    borderRadius: 12,
  },

  // ========================
  // 🧭 FOOTER STYLE (Enhanced)
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
  },

  footerIcon: {
    flex: 1,
    alignItems: "center",
  },
});