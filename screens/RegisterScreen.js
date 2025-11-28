// RegisterScreen.js
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
  ScrollView
} from 'react-native';
import React, { useState } from 'react';
import { styles } from './styles/RegisterScreenStyle';
import { FontAwesome } from '@expo/vector-icons';

const API_BASE_URL = "https://aquameter-backend-8u1x.onrender.com/api/auth";

const RegisterScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    username: '',
    password: '',
    email: '',
    first_name: '',
    last_name: '',
    middle_initial: '',
    mobile_number: '',
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
    if (field === 'password') setPasswordError('');
  };

  const handleRegister = async () => {
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

    if (!form.username || !form.password || !form.email || !form.first_name || !form.last_name || !form.mobile_number) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    if (form.password.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      return;
    }

    if (!specialCharRegex.test(form.password)) {
      setPasswordError("Password must contain at least one special character (!@#$%^&*).");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        Alert.alert("Success", "User registered successfully!", [
          { text: "OK", onPress: () => navigation.navigate("LoginScreen") }
        ]);

        setForm({ 
          username: '',
          password: '',
          email: '',
          first_name: '',
          last_name: '',
          middle_initial: '',
          mobile_number: '',
        });
        setPasswordError('');
      } else {
        Alert.alert("Error", data.error || "Registration failed");
      }
    } catch (error) {
      console.error("❌ Register error:", error);
      Alert.alert("Error", "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ImageBackground 
        source={require('../assets/bg.png')} 
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>

            <View style={styles.logoContainer}>
              <Image source={require('../assets/logo-login.png')} style={styles.logo} />
            </View>

            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <TextInput 
                  placeholder="Username" 
                  style={styles.input} 
                  value={form.username} 
                  onChangeText={(v) => handleChange('username', v)} 
                  placeholderTextColor="#666"
                />
              </View>

              <View style={styles.inputContainer}>
                <View style={[styles.passwordContainer, passwordError ? styles.inputError : null]}>
                  <TextInput 
                    placeholder="Password" 
                    style={styles.passwordInput} 
                    secureTextEntry={!showPassword} 
                    value={form.password} 
                    onChangeText={(v) => handleChange('password', v)} 
                    placeholderTextColor="#666"
                  />
                  <TouchableOpacity 
                    style={styles.eyeIcon} 
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <FontAwesome name={showPassword ? 'eye' : 'eye-slash'} size={20} color="#666" />
                  </TouchableOpacity>
                </View>
                {passwordError ? <Text style={styles.passwordErrorText}>{passwordError}</Text> : null}
              </View>

              <View style={styles.nameInputRow}>
                <TextInput 
                  placeholder="First Name" 
                  style={styles.firstNameInput} 
                  value={form.first_name} 
                  onChangeText={(v) => handleChange('first_name', v)} 
                  placeholderTextColor="#666"
                />
                <TextInput 
                  placeholder="Last Name" 
                  style={styles.lastNameInput} 
                  value={form.last_name} 
                  onChangeText={(v) => handleChange('last_name', v)} 
                  placeholderTextColor="#666"
                />
              </View>

              <View style={styles.inputContainer}>
                <TextInput 
                  placeholder="Middle Initial" 
                  style={styles.middleInitialInput} 
                  value={form.middle_initial} 
                  maxLength={1} 
                  onChangeText={(v) => handleChange('middle_initial', v)} 
                  placeholderTextColor="#666"
                />
              </View>

              <View style={styles.inputContainer}>
                <TextInput 
                  placeholder="Email" 
                  style={styles.input} 
                  value={form.email} 
                  onChangeText={(v) => handleChange('email', v)} 
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#666"
                />
              </View>

              <View style={styles.inputContainer}>
                <TextInput 
                  placeholder="Mobile Number" 
                  style={styles.input} 
                  value={form.mobile_number} 
                  onChangeText={(v) => handleChange('mobile_number', v)} 
                  keyboardType="phone-pad" 
                  placeholderTextColor="#666"
                />
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity 
                  style={[styles.registerButton, loading ? styles.registerButtonDisabled : null]} 
                  onPress={handleRegister}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.registerButtonText}>REGISTER</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.loginRedirectButton}
                  onPress={() => navigation.navigate("LoginScreen")}
                >
                  <Text style={styles.loginRedirectText}>SIGN IN</Text>
                </TouchableOpacity>
              </View>

            </View>

          </ScrollView>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
