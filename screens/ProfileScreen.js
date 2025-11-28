import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Switch,
} from "react-native";
import { styles } from "./styles/ProfileScreenStyle";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";

const BASE_URL = "https://aquameter-backend-8u1x.onrender.com";

const ProfileScreen = ({ navigation, route }) => {
  const userFromParams = route.params?.user || null;
  const [profile, setProfile] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isHidden, setIsHidden] = useState(false);

  // EDIT MODE
  const [editing, setEditing] = useState(false);
  const [editValues, setEditValues] = useState({
    first_name: "",
    last_name: "",
    middle_initial: "",
    mobile_number: "",
    username: "",
  });

  // ==========================
  // PICK IMAGE
  // ==========================
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Camera roll access is needed.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setProfileImage(imageUri);
      await uploadImage(imageUri);
    }
  };

  // ==========================
  // UPLOAD IMAGE
  // ==========================
  const uploadImage = async (uri) => {
    try {
      if (!profile || !profile.user_id) {
        Alert.alert("Error", "User not found. Please log in again.");
        return;
      }

      const token = await AsyncStorage.getItem("token");

      let formData = new FormData();
      formData.append("profile_image", {
        uri,
        name: `profile_${profile.user_id}.jpg`,
        type: "image/jpeg",
      });

      const response = await fetch(`${BASE_URL}/profile/${profile.user_id}/upload`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success && data.profile_image) {
        const imageUrl = data.profile_image.startsWith("http")
          ? data.profile_image
          : `${BASE_URL}${data.profile_image}`;

        setProfile((prev) => ({ ...prev, profile_image: imageUrl }));
        setProfileImage(imageUrl);

        const updatedUser = { ...profile, profile_image: imageUrl };
        await AsyncStorage.setItem("user", JSON.stringify(updatedUser));

        Alert.alert("Success", "Profile image updated.");
      } else {
        Alert.alert("Error", data.message || "Image upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert("Error", "Failed to upload image.");
    }
  };

  // ==========================
  // FETCH PROFILE
  // ==========================
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        let storedUser = await AsyncStorage.getItem("user");
        let userData = userFromParams || (storedUser ? JSON.parse(storedUser) : null);

        if (!userData) return;

        const response = await fetch(`${BASE_URL}/profile/${userData.user_id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (data.success && data.user) {
          const userInfo = data.user;

          const imageUrl = userInfo.profile_image
            ? userInfo.profile_image.startsWith("http")
              ? userInfo.profile_image
              : `${BASE_URL}${userInfo.profile_image}`
            : null;

          const updatedUser = { ...userInfo, profile_image: imageUrl };

          setProfile(updatedUser);
          setProfileImage(imageUrl);
          setIsHidden(updatedUser.is_hidden);

          await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
        }
      } catch (error) {
        console.error("❌ Profile fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ==========================
  // START EDIT MODE
  // ==========================
  const startEditing = () => {
    setEditValues({
      first_name: profile.first_name || "",
      last_name: profile.last_name || "",
      middle_initial: profile.middle_initial || "",
      mobile_number: profile.mobile_number || "",
      username: profile.username || "",
    });
    setEditing(true);
  };

  // ==========================
  // SAVE PROFILE
  // ==========================
  const saveChanges = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const response = await fetch(`${BASE_URL}/profile/${profile.user_id}/update`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editValues),
      });

      const data = await response.json();

      if (data.success) {
        const updated = { ...profile, ...editValues };
        setProfile(updated);
        await AsyncStorage.setItem("user", JSON.stringify(updated));

        setEditing(false);
        Alert.alert("Success", "Profile updated.");
      }
    } catch (error) {
      Alert.alert("Error", "Unable to update profile.");
    }
  };

  // ==========================
  // 🔄 TOGGLE HIDE INFO
  // ==========================
  const toggleHideInfo = async (value) => {
    setIsHidden(value);

    try {
      const token = await AsyncStorage.getItem("token");

      const response = await fetch(
        `${BASE_URL}/profile/${profile.user_id}/privacy`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ is_private: value }), // Corrected field name
        }
      );

      const data = await response.json();

      if (data.success) {
        const updated = { ...profile, is_hidden: value };
        setProfile(updated);
        await AsyncStorage.setItem("user", JSON.stringify(updated));
      } else {
        Alert.alert("Error", data.message || "Failed to update privacy.");
        setIsHidden(!value);
      }
    } catch (error) {
      Alert.alert("Error", "Network error.");
      setIsHidden(!value);
    }
  };


  // ==========================
  // LOADING SCREEN
  // ==========================
  if (loading)
    return <ActivityIndicator size="large" color="#1D3B66" style={{ flex: 1 }} />;

  if (!profile)
    return <Text style={{ textAlign: "center", marginTop: 20 }}>No profile data found.</Text>;

  return (
    <View style={styles.container}>
      {/* Header (UNCHANGED) */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>PROFILE</Text>
        {/* Placeholder logo image is replaced with a functional image, assuming `cropped-logo.png` is available */}
        <Image 
          source={{ uri: "https://placehold.co/60x60/1D3B66/FFFFFF?text=Logo" }} 
          style={styles.headerLogo} 
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Card (Enhanced Shadow) */}
        <View style={styles.profileCard}>
          <TouchableOpacity onPress={pickImage} style={styles.profileImageContainer}>
            <Image
              source={
                profileImage
                  ? { uri: profileImage }
                  : {
                      uri: `https://via.placeholder.com/150/1D3B66/FFFFFF?text=${
                        profile.username ? profile.username[0].toUpperCase() : "U"
                      }`,
                    }
              }
              style={styles.profileImage}
            />

            <View style={styles.editIconContainer}>
              <Ionicons name="camera" size={20} color="white" />
            </View>
          </TouchableOpacity>

          {/* Name */}
          {editing ? (
            <>
              <TextInput
                style={styles.editInput}
                value={editValues.first_name}
                onChangeText={(v) => setEditValues({ ...editValues, first_name: v })}
                placeholder="First Name"
              />

              <TextInput
                style={styles.editInput}
                value={editValues.last_name}
                onChangeText={(v) => setEditValues({ ...editValues, last_name: v })}
                placeholder="Last Name"
              />

              <TextInput
                style={styles.editInput}
                value={editValues.middle_initial}
                onChangeText={(v) => setEditValues({ ...editValues, middle_initial: v })}
                placeholder="Middle Initial"
              />
            </>
          ) : (
            <Text style={styles.profileName}>
              {profile.first_name} {profile.middle_initial} {profile.last_name}
            </Text>
          )}

          {/* Username */}
          {editing ? (
            <TextInput
              style={styles.editInput}
              value={editValues.username}
              onChangeText={(v) => setEditValues({ ...editValues, username: v })}
              placeholder="Username"
            />
          ) : (
            <Text style={styles.profileDetails}>Username: {profile.username}</Text>
          )}
        </View>

        {/* Contact Details (Enhanced Shadow) */}
        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Contact Details</Text>

          {/* Mobile */}
          <View style={styles.detailRow}>
            <Ionicons name="call-outline" size={24} color="#1D3B66" style={styles.detailIcon} />

            {editing ? (
              <TextInput
                style={styles.editInputSmall}
                value={editValues.mobile_number}
                onChangeText={(v) => setEditValues({ ...editValues, mobile_number: v })}
                placeholder="Mobile Number"
              />
            ) : (
              <Text style={styles.detailText}>{profile.mobile_number || "N/A"}</Text>
            )}
          </View>

          {/* Static Location */}
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={24} color="#1D3B66" style={styles.detailIcon} />
            <Text style={styles.detailText}>Cagayan de Oro City</Text>
          </View>

          {/* Privacy Toggle */}
          <View style={styles.toggleRow}>
            <Ionicons
              name="eye-off-outline"
              size={24}
              color="#1D3B66"
              style={styles.detailIcon}
            />
            <Text style={styles.detailText}>Hide my information</Text>

            <Switch
              style={{ marginLeft: "auto" }}
              value={isHidden}
              onValueChange={toggleHideInfo}
              thumbColor={isHidden ? "#1D3B66" : "#f4f3f4"}
              trackColor={{ false: "#ccc", true: "#9bbcd0" }}
            />
          </View>
        </View>

        {/* Edit Buttons */}
        {!editing ? (
          <>
            <TouchableOpacity style={styles.editButton} onPress={startEditing}>
              <Ionicons name="create-outline" size={20} color="#1D3B66" />
              <Text style={styles.editButtonText}>EDIT PROFILE</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View>
            <TouchableOpacity style={styles.saveButton} onPress={saveChanges}>
              <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
              <Text style={styles.saveButtonText}>SAVE CHANGES</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={() => setEditing(false)}>
              <Ionicons name="close-circle-outline" size={20} color="#FF6347" />
              <Text style={styles.cancelButtonText}>CANCEL</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => {
            Alert.alert("Log Out", "Are you sure you want to log out?", [
              { text: "Cancel", style: "cancel" },
              {
                text: "Log Out",
                onPress: async () => {
                  await AsyncStorage.multiRemove(["user", "profileImage", "token"]);
                  navigation.navigate("LoginScreen");
                },
              },
            ]);
          }}
        >
          <Ionicons name="log-out-outline" size={20} color="#FF6347" />
          <Text style={styles.logoutText}>LOG OUT</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Footer (Updated Icons) */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerIcon}
          onPress={() => navigation.navigate("TrendLineScreen")}
        >
          <Ionicons name="stats-chart-outline" size={28} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerIcon} onPress={() => navigation.navigate("HomeScreen")}>
          <Ionicons name="home-outline" size={28} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerIcon}>
          {/* Active icon for the current screen */}
          <Ionicons name="person-sharp" size={28} color="#1D3B66" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileScreen;