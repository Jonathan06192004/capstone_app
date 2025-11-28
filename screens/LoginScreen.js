// LoginScreen.js
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  ImageBackground,
  Image,
} from "react-native";
import React, { useState } from "react";
import { styles } from "./styles/LoginScreenStyle";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { registerForPushNotificationsAsync } from "../services/NotificationService";

const API_BASE_URL = "https://aquameter-backend-8u1x.onrender.com/api/auth";

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

const handleLogin = async () => {
  setUsernameError("");
  setPasswordError("");

  if (!username || !password) {
    if (!username) setUsernameError("Username is required");
    if (!password) setPasswordError("Password is required");
    return;
  }

  setLoading(true);

  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (data.success && data.user && data.token) {

      // ✅ Save user + token
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      await AsyncStorage.setItem("token", data.token);

      // 🔔 Register notifications
      try {
        const tokens = await registerForPushNotificationsAsync(data.user.user_id);
        if (tokens) console.log("✅ Notification tokens registered:", tokens);
      } catch (notifError) {
        console.error("❌ Failed to register notification tokens:", notifError);
      }

      Alert.alert("Success", "Login successful!", [
        {
          text: "OK",
          onPress: () =>
            navigation.replace("HomeScreen", {
              user: data.user,
              token: data.token,
            }),
        },
      ]);
    } else {
      Alert.alert("Login Failed", data.error || "Invalid username or password");
    }
  } catch (error) {
    console.error("❌ Error logging in:", error);
    Alert.alert("Error", "Unable to connect to the server");
  } finally {
    setLoading(false);
  }
};


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ImageBackground
        source={require("../assets/bg.png")}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/logo-login.png")}
              style={styles.logo}
            />
          </View>

          <View style={styles.formContainer}>
            {/* Username Input */}
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, usernameError ? styles.inputError : null]}
                placeholder="Username"
                placeholderTextColor="#666"
                value={username}
                onChangeText={(text) => {
                  setUsername(text);
                  setUsernameError("");
                }}
                autoCapitalize="none"
                editable={!loading}
              />
              {usernameError && <Text style={styles.errorText}>{usernameError}</Text>}
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[
                    styles.passwordInput,
                    passwordError ? styles.inputError : null,
                  ]}
                  placeholder="Password"
                  placeholderTextColor="#666"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setPasswordError("");
                  }}
                  secureTextEntry={!showPassword}
                  editable={!loading}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <FontAwesome
                    name={showPassword ? "eye" : "eye-slash"}
                    size={20}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>
              {passwordError && (
                <Text style={styles.errorText}>{passwordError}</Text>
              )}
            </View>

            {/* Forgot Password */}
            <TouchableOpacity
              style={styles.forgotPasswordButton}
              onPress={() => navigation.navigate("ForgotPasswordScreen")}
            >
              <Text style={styles.forgotPassword}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[
                  styles.loginButton,
                  loading ? styles.loginButtonDisabled : null,
                ]}
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.loginButtonText}>SIGN IN</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.registerButton}
                onPress={() => navigation.navigate("RegisterScreen")}
              >
                <Text style={styles.registerButtonText}>CREATE ACCOUNT</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
