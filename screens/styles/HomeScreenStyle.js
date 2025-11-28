import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EDEFF1",
  },
  scrollView: {
    flexGrow: 1,
    paddingHorizontal: 15,
    paddingBottom: 70, // Added padding to prevent content from being hidden by the footer
  },

  // Header Section
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#3C6382",
    paddingHorizontal: 15,
    paddingVertical: 15,
    paddingTop: 50,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileCircle: {
    width: 55, // Slightly smaller for better balance
    height: 55,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#fff",
    overflow: 'hidden',
  },
  profileImage: {
    width: 55, // Match container size
    height: 55,
    borderRadius: 30,
  },
  greeting: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 15,
  },
  notificationButton: {
    padding: 5,
  },

  // Date
  dateContainer: {
    alignItems: "flex-start",
    marginVertical: 15,
    marginLeft: 10,
  },
  dayText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  dateText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginTop: 2,
  },

  // Sections
  sectionTitleDashboard: {
    fontSize: 22,
    fontWeight: "900",
    color: "#1E3D6B",
    marginVertical: 20,
    left: 10,
  },
  dashboard: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: -5,
  },
  card: {
    flex: 1,
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 8,
    alignItems: "flex-start",
    justifyContent: "space-between",
    height: 140,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 10,
  },
  cardDetails: {
    fontSize: 12,
    color: "#E0E0E0",
    marginTop: 5,
  },

  // Device status
  deviceCardWrapper: {
    marginTop: 15,
    paddingHorizontal: 5,
  },
  deviceCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
  deviceCardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E3D6B",
  },
  deviceCardSubtitle: {
    fontSize: 13,
    color: "#666",
    marginTop: 6,
  },
  deviceStatusText: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 10,
    color: "#333",
  },

  // Water Rate Section (Refactored from inline styles)
  waterRateContainer: {
    marginTop: 25,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  waterRateLabel: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
    color: "#1E3D6B",
  },
  waterRateInput: {
    backgroundColor: "#F7F7F7",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
  },
  waterRateButton: {
    backgroundColor: "#1E3D6B",
    padding: 12,
    borderRadius: 10,
    marginTop: 15,
    alignItems: "center",
    shadowColor: "#1E3D6B",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 6,
  },
  waterRateButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },

  // Trend Line Link
  trendLineLink: {
    marginTop: 30,
    alignItems: "center",
    padding: 10,
    marginBottom: 20,
  },
  trendLineLinkText: {
    color: "#1E3D6B",
    fontSize: 16,
    fontWeight: "800",
    textDecorationLine: 'underline',
  },

  // Footer
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#C2E6F5",
    paddingVertical: 1, // Increased size for a bigger footer
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 15, // Increased elevation for a floating effect
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 }, // Deeper shadow
    shadowOpacity: 0.1,
    shadowRadius: 8,
    paddingHorizontal: 10,
  },
  footerIcon: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
  },
  activeIconWrapper: {
    // Wrapper for the active icon to create the floating circle effect
    backgroundColor: '#E6F0FF', // Very light blue for active indicator background
    padding: 10,
    borderRadius: 50, // Circle shape
    transform: [{ translateY: -15 }], // Lifts the active icon out of the bar
    // Shadow for the active button only
    shadowColor: "#1E3D6B",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 8,
  }
});