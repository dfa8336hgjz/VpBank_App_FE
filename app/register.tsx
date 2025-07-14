import Checkbox from 'expo-checkbox'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { registerApi } from '../services/api'
export default function Register() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [dobYear, setDobYear] = useState('')
  const [dobMonth, setDobMonth] = useState('')
  const [dobDay, setDobDay] = useState('')
  const [city, setCity] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [agreePolicy, setAgreePolicy] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const isValid = username && password && confirmPassword && email && firstName && lastName && dobYear && dobMonth && dobDay && city && password === confirmPassword && agreeTerms && agreePolicy
  async function handleRegister() {
    setLoading(true)
    setError('')
    try {
      const dob = `${dobYear.padStart(4, '0')}-${dobMonth.padStart(2, '0')}-${dobDay.padStart(2, '0')}`
      await registerApi({ username, password, email, firstName, lastName, dob, city })
      Alert.alert('Success', 'Registration successful, please login')
      router.replace('/login')
    } catch (e: any) {
      setError(e?.response?.data?.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Join HDCBank</Text>
        <Text style={styles.subtitle}>Create an account to experience our services</Text>
        <View style={styles.securityBox}>
          <Text style={styles.securityText}>Information security: Your data is encrypted and protected according to international banking standards.</Text>
        </View>
        <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} />
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <TextInput style={styles.input} placeholder="First Name" value={firstName} onChangeText={setFirstName} />
        <TextInput style={styles.input} placeholder="Last Name" value={lastName} onChangeText={setLastName} />
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
          <TextInput style={[styles.input, { flex: 2, marginBottom: 0 }]} placeholder="YYYY" value={dobYear} onChangeText={setDobYear} keyboardType="number-pad" maxLength={4} returnKeyType="next" autoCapitalize="none" autoCorrect={false} />
          <TextInput style={[styles.input, { flex: 1, marginBottom: 0 }]} placeholder="MM" value={dobMonth} onChangeText={setDobMonth} keyboardType="number-pad" maxLength={2} returnKeyType="next" autoCapitalize="none" autoCorrect={false} />
          <TextInput style={[styles.input, { flex: 1, marginBottom: 0 }]} placeholder="DD" value={dobDay} onChangeText={setDobDay} keyboardType="number-pad" maxLength={2} returnKeyType="done" autoCapitalize="none" autoCorrect={false} />
        </View>
        <TextInput style={styles.input} placeholder="City" value={city} onChangeText={setCity} />
        <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
        <TextInput style={styles.input} placeholder="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
        <View style={styles.checkboxRow}>
          <Checkbox value={agreeTerms} onValueChange={setAgreeTerms} />
          <Text style={styles.checkboxLabel}>I agree to HDCBank's Terms of Service</Text>
        </View>
        <View style={styles.checkboxRow}>
          <Checkbox value={agreePolicy} onValueChange={setAgreePolicy} />
          <Text style={styles.checkboxLabel}>I agree to the Privacy Policy and allow processing of personal data</Text>
        </View>
        {error ? <Text style={{ color: 'red', textAlign: 'center', marginBottom: 8 }}>{error}</Text> : null}
        <TouchableOpacity style={[styles.button, !isValid && styles.buttonDisabled]} disabled={!isValid || loading} onPress={handleRegister}>
          <Text style={styles.buttonText}>{loading ? 'Creating...' : 'Create Account'}</Text>
        </TouchableOpacity>
        <View style={{ alignItems: 'center', marginTop: 16 }}>
          <Text>Already have an account? <Text style={styles.loginLink} onPress={() => router.replace('/login')}>Login now</Text></Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#fff', padding: 24 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1A8754', textAlign: 'center', marginTop: 40 },
  subtitle: { fontSize: 15, color: '#333', textAlign: 'center', marginBottom: 24 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 16 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  checkboxLabel: { marginLeft: 8, fontSize: 14, color: '#333', flex: 1 },
  button: { backgroundColor: '#1A8754', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 16 },
  buttonDisabled: { backgroundColor: '#b5b5b5' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  loginLink: { color: '#1A8754', fontWeight: 'bold' },
  securityBox: { backgroundColor: '#e6f7ee', borderRadius: 8, padding: 12, marginTop: 8, marginBottom: 24 },
  securityText: { color: '#1A8754', fontSize: 13, textAlign: 'center' }
}) 