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
  Image 
} from 'react-native';
import React, { useState } from 'react';
import { styles } from './styles/ForgotPasswordScreenStyle';
import { FontAwesome } from "@expo/vector-icons"; 

const API_URL = "https://aquameter-backend-8u1x.onrender.com/api/auth";
const SPECIAL_CHAR_REGEX = /[!@#$%^&*(),.?":{}|<>]/; // Regex to check for special characters

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleResetPassword = async () => {
    setEmailError('');
    setPasswordError('');

    let isValid = true;
    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    }
    
    if (!newPassword) {
      setPasswordError("New password is required");
      isValid = false;
    } else if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      isValid = false;
    } else if (!SPECIAL_CHAR_REGEX.test(newPassword)) { // 👈 Added special character check
      setPasswordError("Password must contain at least one special character (!@#$%^&*)");
      isValid = false;
    }

    if (!isValid) return;

    setLoading(true);

    try {
      // STEP 1: verify email
      const verify = await fetch(`${API_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const verifyData = await verify.json();

      if (!verifyData.success) {
        Alert.alert("Error", verifyData.message || "Email not found");
        setLoading(false);
        return;
      }

      const user_id = verifyData.user_id;

      // STEP 2: reset password
      const response = await fetch(`${API_URL}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id, new_password: newPassword }),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert("Success", "Password updated successfully!", [
          { text: "OK", onPress: () => navigation.navigate("LoginScreen") }
        ]);
      } else {
        Alert.alert("Error", data.message || "Failed to reset password");
      }
    } catch (error) {
      console.error("❌ Reset password error:", error);
      Alert.alert("Error", "Unable to connect to server");
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
        source={require('../assets/bg.png')} 
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay}>

          <View style={styles.logoContainer}>
            <Image source={require('../assets/logo-login.png')} style={styles.logo} />
          </View>

          <View style={styles.formContainer}>

            {/* Email */}
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, emailError ? styles.inputError : null]}
                placeholder="Enter your email"
                placeholderTextColor="#666"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setEmailError('');
                }}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!loading}
              />
              {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
            </View>

            {/* New Password with Eye Toggle */}
            <View style={styles.inputContainer}>
              <View style={styles.passwordContainer}> 
                <TextInput
                  style={[styles.passwordInput, passwordError ? styles.inputError : null]}
                  placeholder="Enter new password"
                  placeholderTextColor="#666"
                  secureTextEntry={!showPassword}
                  value={newPassword}
                  onChangeText={(text) => {
                    setNewPassword(text);
                    setPasswordError('');
                  }}
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

              {/* Updated Error Message */}
              {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
            </View>

            {/* Reset Button */}
            <TouchableOpacity 
              style={[styles.resetButton, loading ? styles.resetButtonDisabled : null]} 
              onPress={handleResetPassword}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.resetButtonText}>RESET PASSWORD</Text>
              )}
            </TouchableOpacity>

            {/* Back */}
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => navigation.navigate("LoginScreen")}
            >
              <Text style={styles.backButtonText}>Back to Login</Text>
            </TouchableOpacity>

          </View>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export default ForgotPasswordScreen;