// styles/NotificationScreenStyle.js

import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2C3E50",
    marginBottom: 15,
  },
  scrollView: {
    flex: 1,
    marginBottom: 20,
  },
  notificationCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center",
  },
  iconContainer: {
    marginRight: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: "#555",
    marginBottom: 6,
  },
  time: {
    fontSize: 12,
    color: "#888",
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E74C3C",
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  clearButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
