import Checkbox from 'expo-checkbox'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { authAPI } from '../services/auth-api'

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

  const isValidYear = (year: string) => {
    const yearNum = parseInt(year)
    const currentYear = new Date().getFullYear()
    return yearNum >= 1900 && yearNum <= currentYear
  }

  const isValidMonth = (month: string) => {
    const monthNum = parseInt(month)
    return monthNum >= 1 && monthNum <= 12
  }

  const isValidDay = (day: string, month: string, year: string) => {
    const dayNum = parseInt(day)
    const monthNum = parseInt(month)
    const yearNum = parseInt(year)
    
    if (dayNum < 1) return false
    
    const daysInMonth = new Date(yearNum, monthNum, 0).getDate()
    return dayNum <= daysInMonth
  }

  const handleYearChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, '')
    setDobYear(numericValue)
  }

  const handleMonthChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, '')
    if (numericValue === '' || (parseInt(numericValue) >= 0 && parseInt(numericValue) <= 12)) {
      setDobMonth(numericValue)
    }
  }

  const handleDayChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, '')
    if (numericValue === '' || (parseInt(numericValue) >= 0 && parseInt(numericValue) <= 31)) {
      setDobDay(numericValue)
    }
  }

  const isDateValid = () => {
    if (!dobYear || !dobMonth || !dobDay) return false
    return isValidYear(dobYear) && isValidMonth(dobMonth) && isValidDay(dobDay, dobMonth, dobYear)
  }
  
  const isValid = username && password && confirmPassword && email && firstName && lastName && isDateValid() && password === confirmPassword && agreeTerms && agreePolicy

  async function handleRegister() {
    setLoading(true)
    setError('')
    try {
      const dob = `${dobYear.padStart(4, '0')}-${dobMonth.padStart(2, '0')}-${dobDay.padStart(2, '0')}`
      await authAPI.register({ username, password, email, firstName, lastName, dob, city })
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
          <TextInput style={[styles.input, { flex: 2, marginBottom: 0 }, dobYear && !isValidYear(dobYear) && styles.inputError]} placeholder="YYYY" value={dobYear} onChangeText={handleYearChange} keyboardType="number-pad" maxLength={4} returnKeyType="next" autoCapitalize="none" autoCorrect={false} />
          <TextInput style={[styles.input, { flex: 1, marginBottom: 0 }, dobMonth && !isValidMonth(dobMonth) && styles.inputError]} placeholder="MM" value={dobMonth} onChangeText={handleMonthChange} keyboardType="number-pad" maxLength={2} returnKeyType="next" autoCapitalize="none" autoCorrect={false} />
          <TextInput style={[styles.input, { flex: 1, marginBottom: 0 }, dobDay && !isValidDay(dobDay, dobMonth, dobYear) && styles.inputError]} placeholder="DD" value={dobDay} onChangeText={handleDayChange} keyboardType="number-pad" maxLength={2} returnKeyType="done" autoCapitalize="none" autoCorrect={false} />
        </View>
        {(dobYear && !isValidYear(dobYear)) || (dobMonth && !isValidMonth(dobMonth)) || (dobDay && !isValidDay(dobDay, dobMonth, dobYear)) ? (
          <Text style={styles.errorText}>Please enter a valid date of birth</Text>
        ) : null}
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
  inputError: { borderColor: 'red', borderWidth: 1 },
  errorText: { color: 'red', textAlign: 'center', marginTop: -10, marginBottom: 16 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  checkboxLabel: { marginLeft: 8, fontSize: 14, color: '#333', flex: 1 },
  button: { backgroundColor: '#1A8754', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 16 },
  buttonDisabled: { backgroundColor: '#b5b5b5' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  loginLink: { color: '#1A8754', fontWeight: 'bold' },
  securityBox: { backgroundColor: '#e6f7ee', borderRadius: 8, padding: 12, marginTop: 8, marginBottom: 24 },
  securityText: { color: '#1A8754', fontSize: 13, textAlign: 'center' }
}) 