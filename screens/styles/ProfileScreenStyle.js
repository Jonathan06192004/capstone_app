import { StyleSheet, Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EFEFF4",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 80,
  },

  // Header (UNCHANGED as requested)
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1D3B66",
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: 50,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  headerLogo: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },

  // Profile Card (Updated Shadow)
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 25,
    alignItems: "center",
    marginVertical: 20,
    // Enhanced Shadow
    elevation: 8,
    shadowColor: "#1D3B66",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5.46,
  },
  profileImageContainer: {
    position: "relative",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#1D3B66",
  },
  editIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 8,
    borderRadius: 20,
  },

  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginTop: 15,
  },
  profileDetails: {
    fontSize: 16,
    color: "#777",
    marginTop: 5,
  },

  editInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#1D3B66",
    borderRadius: 10,
    padding: 10,
    marginTop: 15,
    fontSize: 16,
  },
  editInputSmall: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#1D3B66",
    borderRadius: 10,
    padding: 8,
    fontSize: 16,
    marginLeft: 10,
  },

  // Details Card (Updated Shadow)
  detailsCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    marginVertical: 10,
    // Enhanced Shadow
    elevation: 8,
    shadowColor: "#1D3B66",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5.46,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1D3B66",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EDEDED",
    paddingBottom: 10,
  },

  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  detailIcon: {
    marginRight: 15,
  },
  detailText: {
    fontSize: 16,
    color: "#555",
  },

  // NEW TOGGLE ROW
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },

  editButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingVertical: 15,
    borderRadius: 15,
    marginTop: 10,
    elevation: 3,
  },
  editButtonText: {
    marginLeft: 10,
    color: "#1D3B66",
    fontSize: 16,
    fontWeight: "bold",
  },

  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1D3B66",
    paddingVertical: 15,
    borderRadius: 15,
    marginTop: 10,
  },
  saveButtonText: {
    marginLeft: 10,
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingVertical: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#FF6347",
    marginTop: 10,
  },
  cancelButtonText: {
    marginLeft: 10,
    color: "#FF6347",
    fontSize: 16,
    fontWeight: "bold",
  },

  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingVertical: 15,
    borderRadius: 15,
    marginTop: 20,
    elevation: 3,
  },
  logoutText: {
    color: "#FF6347",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },

  // Footer (Updated Style)
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
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  footerIcon: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});