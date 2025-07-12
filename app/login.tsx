import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
export default function LoginScreen() {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  async function handleLogin() {
    setLoading(true)
    try {
      // await loginApi(phone, password)
      router.replace('/(tabs)')
    } catch (e: any) {
      Alert.alert('Login Failed', e?.response?.data?.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconWrap}>
          <View style={styles.iconCircle}>
            <Image source={require('../assets/images/icon.png')} style={styles.icon} />
          </View>
        </View>
        <Text style={styles.bankName}>HDCBank</Text>
        <Text style={styles.bankDesc}>Safe & Convenient Digital Bank</Text>
      </View>
      <View style={styles.welcomeWrap}>
        <Text style={styles.welcomeTitle}>Welcome back!</Text>
        <Text style={styles.welcomeDesc}>Login to continue using our services</Text>
      </View>
      <View style={styles.inputWrap}>
        <Text style={styles.label}>Phone Number</Text>
        <View style={styles.inputBox}>
          <TextInput
            style={styles.input}
            placeholder="Enter phone number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>
        <Text style={[styles.label, { marginTop: 16 }]}>Password</Text>
        <View style={styles.inputBox}>
          <TextInput
            style={styles.input}
            placeholder="Enter password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Text style={styles.eye}>{showPassword ? '🙈' : '👁️'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={styles.rowLeft} onPress={() => setRemember(!remember)}>
            <View style={[styles.checkbox, remember && styles.checkboxActive]} />
            <Text style={styles.remember}>Remember me</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/forgot-password')}>
            <Text style={styles.forgot}>Forgot password?</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} disabled={loading}>
        <Text style={styles.loginBtnText}>{loading ? 'Logging in...' : 'Login'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.fingerprintBtn}>
        <Text style={styles.fingerprintText}>Login with fingerprint</Text>
      </TouchableOpacity>
      <View style={styles.signupWrap}>
        <Text style={styles.signupText}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => router.push('/register')}>
          <Text style={styles.signupLink}> Sign up now</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.securityWrap}>
        <Text style={styles.securityText}>Absolute security: Information encrypted with 256-bit. Support hotline: <Text style={{ fontWeight: 'bold' }}>1900 1234</Text></Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 24, paddingTop: 40 },
  header: { alignItems: 'center', marginBottom: 16 },
  iconWrap: { marginBottom: 8 },
  iconCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#E6F4EA', alignItems: 'center', justifyContent: 'center' },
  icon: { width: 40, height: 40 },
  bankName: { fontSize: 24, fontWeight: 'bold', color: '#1A8754', marginTop: 8 },
  bankDesc: { fontSize: 14, color: '#1A8754', marginTop: 2 },
  welcomeWrap: { alignItems: 'center', marginBottom: 24 },
  welcomeTitle: { fontSize: 20, fontWeight: 'bold', color: '#222' },
  welcomeDesc: { fontSize: 14, color: '#666', marginTop: 4 },
  inputWrap: { marginBottom: 16 },
  label: { fontSize: 14, color: '#222', marginBottom: 4 },
  inputBox: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E6E6E6', borderRadius: 8, paddingHorizontal: 12, backgroundColor: '#F8F8F8' },
  input: { flex: 1, height: 44, fontSize: 16 },
  eye: { fontSize: 18, marginLeft: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  rowLeft: { flexDirection: 'row', alignItems: 'center' },
  checkbox: { width: 18, height: 18, borderWidth: 1, borderColor: '#1A8754', borderRadius: 4, marginRight: 6, backgroundColor: '#fff' },
  checkboxActive: { backgroundColor: '#1A8754' },
  remember: { fontSize: 14, color: '#222' },
  forgot: { fontSize: 14, color: '#1A8754', fontWeight: 'bold' },
  loginBtn: { backgroundColor: '#1A8754', borderRadius: 8, alignItems: 'center', paddingVertical: 14, marginTop: 16 },
  loginBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  fingerprintBtn: { borderWidth: 1, borderColor: '#1A8754', borderRadius: 8, alignItems: 'center', paddingVertical: 14, marginTop: 12 },
  fingerprintText: { color: '#1A8754', fontSize: 16, fontWeight: 'bold' },
  signupWrap: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 16 },
  signupText: { fontSize: 14, color: '#222' },
  signupLink: { fontSize: 14, color: '#1A8754', fontWeight: 'bold' },
  securityWrap: { backgroundColor: '#E6F4EA', borderRadius: 8, padding: 12, marginTop: 24 },
  securityText: { color: '#1A8754', fontSize: 13, textAlign: 'center' },
}) 