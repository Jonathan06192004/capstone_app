import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
 container: {
  flex: 1,
  backgroundColor: "#F5F8FA", // Light background color
 },
 scrollContent: {
  padding: 20,
  paddingBottom: 100, // Ensure space above footer
 },

 // ========================
 // 💧 HEADER STYLE (MATCHES TREND LINE SCREEN)
 // ========================
 header: {
  backgroundColor: "#1D3B66", // Primary Dark Blue
  flexDirection: "row",
  justifyContent: "space-between", // Maintain spacing for Title and Logo
  alignItems: "center",
  paddingHorizontal: 20,
  paddingVertical: 20,
  paddingTop: 50,
  borderBottomLeftRadius: 20, // Rounded bottom corners
  borderBottomRightRadius: 20,
  // Stronger, more prominent shadow/elevation
  elevation: 8,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 5.46,
 },

 headerTitle: {
  color: "#fff", // White text
  fontSize: 22, // Slightly larger
  fontWeight: "bold",
  letterSpacing: 1,
 },
 headerLogo: {
  width: 40,
  height: 40,
  borderRadius: 20,
 },

 // Profile Card Styles
 profileCard: {
  backgroundColor: "#fff",
  borderRadius: 15,
  padding: 20,
  alignItems: "center",
  marginBottom: 20,
  shadowColor: "#1D3B66",
  shadowOffset: { width: 0, height: 5 },
  shadowOpacity: 0.15,
  shadowRadius: 10,
  elevation: 8,
 },
 profileImageContainer: {
  width: 100,
  height: 100,
  borderRadius: 50,
  backgroundColor: "#ccc",
  marginBottom: 15,
  position: "relative",
 },
 profileImage: {
  width: "100%",
  height: "100%",
  borderRadius: 50,
 },
 editIconContainer: {
  position: "absolute",
  bottom: 0,
  right: 0,
  backgroundColor: "#3E5C76", // Darker blue for edit icon
  borderRadius: 15,
  padding: 5,
 },
 profileName: {
  fontSize: 24,
  fontWeight: "bold",
  color: "#1D3B66",
  marginBottom: 5,
  textAlign: "center",
 },
 profileDetails: {
  fontSize: 16,
  color: "#666",
  textAlign: "center",
 },

 // Details Card Styles
 detailsCard: {
  backgroundColor: "#fff",
  borderRadius: 15,
  padding: 20,
  marginBottom: 20,
  shadowColor: "#1D3B66",
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.1,
  shadowRadius: 5,
  elevation: 5,
 },
 sectionTitle: {
  fontSize: 18,
  fontWeight: "bold",
  color: "#1D3B66",
  marginBottom: 15,
  borderBottomWidth: 1,
  borderBottomColor: "#eee",
  paddingBottom: 5,
 },
 detailRow: {
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: 10,
  borderBottomWidth: 1,
  borderBottomColor: "#f0f0f0",
 },
 detailIcon: {
  marginRight: 15,
 },
 detailText: {
  fontSize: 16,
  color: "#333",
  flexShrink: 1,
 },
 toggleRow: {
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: 10,
 },

 // Edit Mode Styles
 editInput: {
  width: "100%",
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 8,
  padding: 10,
  marginBottom: 10,
  fontSize: 16,
  color: "#333",
  textAlign: "center",
 },
 editInputSmall: {
  flex: 1, // Take up remaining space
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 8,
  padding: 10,
  fontSize: 16,
  color: "#333",
 },

 // Buttons
 editButton: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#fff",
  borderWidth: 1,
  borderColor: "#1D3B66",
  borderRadius: 8,
  padding: 15,
  marginBottom: 10,
 },
 editButtonText: {
  fontSize: 16,
  fontWeight: "bold",
  color: "#1D3B66",
  marginLeft: 10,
 },
 saveButton: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#3E5C76", // Success color
  borderRadius: 8,
  padding: 15,
  marginBottom: 10,
 },
 saveButtonText: {
  fontSize: 16,
  fontWeight: "bold",
  color: "#fff",
  marginLeft: 10,
 },
 cancelButton: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#fff",
  borderWidth: 1,
  borderColor: "#FF6347", // Tomato red
  borderRadius: 8,
  padding: 15,
  marginBottom: 20,
 },
 cancelButtonText: {
  fontSize: 16,
  fontWeight: "bold",
  color: "#FF6347",
  marginLeft: 10,
 },

 // Logout Button
 logoutButton: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#FFF0F0", // Very light red background
  borderRadius: 8,
  padding: 15,
  borderWidth: 1,
  borderColor: "#FF6347",
 },
 logoutText: {
  fontSize: 16,
  fontWeight: "bold",
  color: "#FF6347",
  marginLeft: 10,
 },

 // ========================
 // 🧭 FOOTER STYLE (MATCHES TREND LINE SCREEN)
 // ========================
 footer: {
  flexDirection: "row",
  justifyContent: "space-around",
  alignItems: "center",
  backgroundColor: "#C2E6F5", // Light blue background
  paddingVertical: 1,
  borderTopLeftRadius: 25,
  borderTopRightRadius: 25,
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  elevation: 15,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: -5 },
  shadowOpacity: 0.1,
  shadowRadius: 8,
  paddingHorizontal: 10,
 },
 footerIcon: {
  flex: 1,
  alignItems: "center",
 },
 activeIconWrapper: {
  backgroundColor: "#1D3B66", // Dark Blue background
  borderRadius: 35, // Circular shape
  width: 55, // Size of the circle
  height: 55, // Size of the circle
  justifyContent: "center",
  alignItems: "center",
  // Optional: lift the active icon slightly
  transform: [{ translateY: -10 }],
  shadowColor: "#1D3B66",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 4.65,
  elevation: 8,
 },
});