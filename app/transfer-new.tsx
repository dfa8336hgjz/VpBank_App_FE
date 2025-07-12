import { FontAwesome } from '@expo/vector-icons'
import React, { useState } from 'react'
import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const banks = [
  { code: 'VCB', name: 'Vietcombank' },
  { code: 'TCB', name: 'Techcombank' },
  { code: 'ACB', name: 'ACB' },
  { code: 'BIDV', name: 'BIDV' },
  { code: 'VPB', name: 'VPBank' },
  { code: 'MBB', name: 'MB Bank' },
]

export default function TransferNewScreen() {
  const [bankModal, setBankModal] = useState(false)
  const [selectedBank, setSelectedBank] = useState(banks[0])
  const [accountNumber, setAccountNumber] = useState('')
  const [receiverName, setReceiverName] = useState('')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')

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
      <TextInput
        style={styles.inputBox}
        placeholder="Account number"
        value={accountNumber}
        onChangeText={setAccountNumber}
        keyboardType="number-pad"
      />
      <TextInput
        style={styles.inputBox}
        placeholder="Receiver's name"
        value={receiverName}
        onChangeText={setReceiverName}
      />
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
      <TouchableOpacity style={styles.confirmBtn}>
        <Text style={styles.confirmBtnText}>Confirm transfer</Text>
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