import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getBalanceApi, getJarInfoApi, loginApi } from '../services/api';
import { useAppDispatch } from '../store/hooks';
import { updateBalances, updateJarPercentagesFromApi } from '../store/jarSlice';

export default function LoginScreen() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const dispatch = useAppDispatch()
  
  async function handleLogin() {
    setLoading(true)
    setError('')
    if (!username || !password) {
      setError('Please enter username and password')
      setLoading(false)
      return
    }
    try {
      await loginApi(username, password)
      
      try {
        const jarInfo = await getJarInfoApi()
        if (jarInfo && jarInfo.code === 1000 && !jarInfo.result) {
          router.replace('/survey')
        } else if (jarInfo && jarInfo.code === 1000 && jarInfo.result) {
          console.log('jarInfo result')
          
          dispatch(updateJarPercentagesFromApi({
            necessitiesPercentage: jarInfo.result.necessitiesPercentage,
            educationPercentage: jarInfo.result.educationPercentage,
            entertainmentPercentage: jarInfo.result.entertainmentPercentage,
            savingsPercentage: jarInfo.result.savingsPercentage,
            investmentPercentage: jarInfo.result.investmentPercentage,
            givingPercentage: jarInfo.result.givingPercentage
          }))
          
          try {
            const balanceInfo = await getBalanceApi()
            if (balanceInfo && balanceInfo.code === 1000 && balanceInfo.result) {
              dispatch(updateBalances({
                necessitiesBalance: balanceInfo.result.necessitiesBalance,
                educationBalance: balanceInfo.result.educationBalance,
                entertainmentBalance: balanceInfo.result.entertainmentBalance,
                savingsBalance: balanceInfo.result.savingsBalance,
                investmentBalance: balanceInfo.result.investmentBalance,
                givingBalance: balanceInfo.result.givingBalance,
                totalBalance: balanceInfo.result.totalBalance
              }))
            }
          } catch (balanceError) {
            console.log('Balance API error:', balanceError)
          }
          
          router.replace('/(tabs)')
        }
      } catch (jarError) {
        console.log('Jar info API error:', jarError)
      }
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Đăng nhập thất bại, vui lòng thử lại')
    } finally {
      setLoading(false)
    }
  }
  return (
    <SafeAreaView style={styles.container}>
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
        <Text style={styles.label}>Username</Text>
        <View style={styles.inputBox}>
          <TextInput
            style={styles.input}
            placeholder="Enter username"
            value={username}
            onChangeText={setUsername}
            keyboardType="default"
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
          {/* <TouchableOpacity onPress={() => router.push('/forgot-password')}>
            <Text style={styles.forgot}>Forgot password?</Text>
          </TouchableOpacity> */}
          {/* <Text style={styles.forgot}>Forgot password?</Text> */}
        </View>
      </View>
      {error ? <Text style={{ color: 'red', textAlign: 'center', marginBottom: 8 }}>{error}</Text> : null}
      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} disabled={loading}>
        <Text style={styles.loginBtnText}>{loading ? 'Logging in...' : 'Login'}</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity style={styles.fingerprintBtn}>
        <Text style={styles.fingerprintText}>Login with fingerprint</Text>
      </TouchableOpacity> */}
      <View style={styles.signupWrap}>
        <Text style={styles.signupText}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => router.push('/register')}>
          <Text style={styles.signupLink}> Sign up now</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.securityWrap}>
        <Text style={styles.securityText}>Absolute security: Information encrypted with 256-bit. Support hotline: <Text style={{ fontWeight: 'bold' }}>1900 1234</Text></Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconWrap: {
    alignItems: 'center',
    marginBottom: 8,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  icon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  bankName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  bankDesc: {
    fontSize: 14,
    color: '#888',
  },
  welcomeWrap: {
    marginBottom: 24,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  welcomeDesc: {
    fontSize: 14,
    color: '#888',
  },
  inputWrap: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
    backgroundColor: '#fafafa',
  },
  input: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: '#222',
  },
  eye: {
    fontSize: 18,
    marginLeft: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 8,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 4,
    marginRight: 8,
    backgroundColor: '#fff',
  },
  checkboxActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  remember: {
    fontSize: 14,
    color: '#333',
  },
  loginBtn: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  loginBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  signupText: {
    fontSize: 14,
    color: '#333',
  },
  signupLink: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  securityWrap: {
    alignItems: 'center',
    marginTop: 16,
  },
  securityText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
})

