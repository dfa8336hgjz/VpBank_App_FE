import { FontAwesome } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getUserSummariesApi, submitTransactionApi } from '../services/api'

const banks = [
  { code: 'VCB', name: 'Vietcombank' },
  { code: 'TCB', name: 'Techcombank' },
  { code: 'ACB', name: 'ACB' },
  { code: 'BIDV', name: 'BIDV' },
  { code: 'VPB', name: 'VPBank' },
  { code: 'MBB', name: 'MB Bank' },
]

type UserSummary = {
  id: string
  userId: string
  firstName: string
  lastName: string
  fullName: string
}

export default function TransferNewScreen() {
  const router = useRouter()
  const [bankModal, setBankModal] = useState(false)
  const [selectedBank, setSelectedBank] = useState(banks[0])
  const [accountNumber, setAccountNumber] = useState('')
  const [receiverName, setReceiverName] = useState('')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [users, setUsers] = useState<UserSummary[]>([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [userModal, setUserModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserSummary | null>(null)
  const [pendingTransaction, setPendingTransaction] = useState<any>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      setUsersLoading(true)
      try {
        const data = await getUserSummariesApi()
        setUsers(data)
      } catch (e) {
        setUsers([])
      } finally {
        setUsersLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const handleConfirmTransfer = async () => {
    if (!selectedUser || !amount) {
      Alert.alert('Error', 'Please select receiver and enter amount')
      return
    }

    const numericAmount = parseFloat(amount)
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount')
      return
    }

    setIsLoading(true)

    try {
      const transactionData = {
        receiverProfileId: selectedUser.userId,
        amount: numericAmount,
        content: note || `Transfer to ${selectedUser.fullName}`
      }
      const res = await submitTransactionApi(transactionData)
      setPendingTransaction(res.result)
      router.push(`/transfer-confirm?transaction=${encodeURIComponent(JSON.stringify(res.result))}`)
    } catch (error) {
      console.error('Transaction failed:', error)
      Alert.alert(
        'Transaction Failed',
        error instanceof Error ? error.message : 'An error occurred during the transaction'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Transfer</Text>
      <TouchableOpacity style={styles.inputBox} onPress={() => setBankModal(true)}>
        <Text style={styles.inputLabel}>Bank</Text>
        <View style={styles.bankRow}>
          <Text style={styles.bankText}>{selectedBank.name}</Text>
          <FontAwesome name="chevron-down" size={16} color="#888" />
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.inputBox} onPress={() => setUserModal(true)}>
        <Text style={styles.inputLabel}>Receiver</Text>
        <View style={styles.bankRow}>
          <Text style={styles.bankText}>{selectedUser ? selectedUser.fullName : 'Select receiver'}</Text>
          <FontAwesome name="chevron-down" size={16} color="#888" />
        </View>
      </TouchableOpacity>
      <TextInput
        style={styles.inputBox}
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="number-pad"
      />
      <TextInput
        style={styles.inputBox}
        placeholder="Note (optional)"
        value={note}
        onChangeText={setNote}
      />
      <TouchableOpacity 
        style={[styles.confirmBtn, isLoading && styles.confirmBtnDisabled]}
        onPress={handleConfirmTransfer}
        disabled={isLoading}
      >
        <Text style={styles.confirmBtnText}>
          {isLoading ? 'Processing...' : 'Confirm transfer'}
        </Text>
      </TouchableOpacity>
      <Modal visible={bankModal} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setBankModal(false)}>
          <View style={styles.modalContent}>
            <FlatList
              data={banks}
              keyExtractor={item => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.bankItem}
                  onPress={() => {
                    setSelectedBank(item)
                    setBankModal(false)
                  }}
                >
                  <Text style={styles.bankText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
      <Modal visible={userModal} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setUserModal(false)}>
          <View style={styles.modalContent}>
            {usersLoading ? (
              <ActivityIndicator size="large" color="#1A75FF" />
            ) : (
              <FlatList
                data={users}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.bankItem}
                    onPress={() => {
                      setSelectedUser(item)
                      setUserModal(false)
                    }}
                  >
                    <Text style={styles.bankText}>{item.fullName}</Text>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
    padding: 18,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A75FF',
    marginBottom: 18,
    textAlign: 'center',
  },
  inputBox: {
    backgroundColor: '#F4F6FB',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E6F0FF',
  },
  inputLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 2,
  },
  bankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bankText: {
    fontSize: 16,
    color: '#222',
  },
  confirmBtn: {
    backgroundColor: '#1A75FF',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    width: 300,
    maxHeight: 350,
  },
  bankItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
}) 