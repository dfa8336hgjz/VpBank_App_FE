import { FontAwesome5 } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useMemo, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { confirmTransactionApi } from '../services/api'

const JAR_TYPES = [
  'NECESSITIES',
  'EDUCATION',
  'ENTERTAINMENT',
  'SAVINGS',
  'INVESTMENT',
  'GIVING',
]

export default function TransferConfirmScreen() {
  const router = useRouter()
  const { transaction } = useLocalSearchParams<{ transaction: string }>()
  const tx = useMemo(() => {
    try {
      return transaction ? JSON.parse(transaction) : null
    } catch {
      return null
    }
  }, [transaction])
  const [selectedJar, setSelectedJar] = useState<string>(tx?.suggestedJarType || 'NECESSITIES')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<'success' | 'error' | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  if (!tx) return <View style={styles.container}><Text>Invalid transaction</Text></View>

  const handleConfirm = async () => {
    setIsLoading(true)
    setResult(null)
    setErrorMsg('')
    try {
      console.log(tx.id, selectedJar)
      const res = await confirmTransactionApi({ transactionId: tx.id, actualJarType: selectedJar })
      setResult('success')
    } catch (e: any) {
      setResult('error')
      setErrorMsg(e?.message || 'Failed to confirm transaction')
    } finally {
      setIsLoading(false)
    }
  }

  if (result === 'success') {
    return (
      <View style={styles.container}>
        <View style={styles.successContainer}>
          <View style={styles.successIconContainer}>
            <FontAwesome5 name="check-circle" size={80} color="#1A8754" />
          </View>
          <Text style={styles.successTitle}>Transaction Confirmed!</Text>
          <Text style={styles.successMessage}>
            Your transaction has been successfully processed and confirmed.
          </Text>
          <View style={styles.successDivider} />
          <TouchableOpacity 
            style={styles.successBtn} 
            onPress={() => router.replace('/(tabs)/transfer')}
          >
            <FontAwesome5 name="arrow-left" size={16} color="#fff" style={styles.btnIcon} />
            <Text style={styles.successBtnText}>Back to Transfer</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
  if (result === 'error') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Transaction Failed</Text>
        <Text style={[styles.value, { color: 'red' }]}>{errorMsg}</Text>
        <TouchableOpacity style={styles.confirmBtn} onPress={() => setResult(null)}>
          <Text style={styles.confirmBtnText}>Try Again</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.confirmBtn, { backgroundColor: '#888', marginTop: 8 }]} onPress={() => router.replace('/(tabs)/transfer')}>
          <Text style={styles.confirmBtnText}>Back to Transfer</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirm Transaction</Text>
      <View style={styles.infoBox}>
        <Text style={styles.label}>Amount:</Text>
        <Text style={styles.value}>{tx.amount.toLocaleString('vi-VN')} ₫</Text>
        <Text style={styles.label}>Content:</Text>
        <Text style={styles.value}>{tx.content}</Text>
        <Text style={styles.label}>Suggested Jar:</Text>
        <Text style={styles.value}>{tx.suggestedJarType}</Text>
      </View>
      <Text style={styles.label}>Select Jar</Text>
      <View style={styles.jarsRow}>
        {JAR_TYPES.map(jar => (
          <TouchableOpacity
            key={jar}
            style={[styles.jarBtn, selectedJar === jar && styles.jarBtnActive]}
            onPress={() => setSelectedJar(jar)}
            disabled={isLoading}
          >
            <Text style={[styles.jarBtnText, selectedJar === jar && styles.jarBtnTextActive]}>{jar}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        style={[styles.confirmBtn, isLoading && styles.confirmBtnDisabled]}
        onPress={handleConfirm}
        disabled={isLoading}
      >
        <Text style={styles.confirmBtnText}>{isLoading ? 'Processing...' : 'Confirm'}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
    padding: 18,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A8754',
    marginBottom: 18,
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 15,
    color: '#888',
    marginTop: 8,
  },
  value: {
    fontSize: 17,
    color: '#222',
    fontWeight: '600',
  },
  jarsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 12,
  },
  jarBtn: {
    borderWidth: 1,
    borderColor: '#1A8754',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  jarBtnActive: {
    backgroundColor: '#1A8754',
  },
  jarBtnText: {
    color: '#1A8754',
    fontWeight: '600',
  },
  jarBtnTextActive: {
    color: '#fff',
  },
  confirmBtn: {
    backgroundColor: '#1A8754',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  confirmBtnDisabled: {
    backgroundColor: '#A0A0A0',
  },
  confirmBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  successContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  successIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A8754',
    marginBottom: 8,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  successDivider: {
    width: '100%',
    height: 1,
    backgroundColor: '#eee',
    marginBottom: 20,
  },
  successBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A8754',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignSelf: 'stretch',
  },
  successBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 10,
  },
  btnIcon: {
    marginRight: 8,
  },
})
