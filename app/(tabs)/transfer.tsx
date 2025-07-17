import { FontAwesome, MaterialIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { getTransactionHistoryApi } from '../../services/api'

export default function TransferScreen() {
  const router = useRouter()
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true)
      try {
        console.log("fetchHistory")
        const data = await getTransactionHistoryApi()
        setTransactions(data)
      } catch {
        setTransactions([])
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [])
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Transactions</Text>
        <TouchableOpacity style={styles.payBtn} onPress={() => router.push('/transfer-new')}>
          <FontAwesome name="plus" size={18} color="#fff" />
          <Text style={styles.payBtnText}>Transfer</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <Text style={{ textAlign: 'center', marginTop: 20 }}>Loading...</Text>
      ) : (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 20 }}>
          {transactions.map(tx => (
            <View key={tx.id} style={styles.txCard}>
              <View style={styles.txIcon}>
                {tx.transactionDirection === 'RECEIVED' && <MaterialIcons name="add-circle-outline" size={24} color="#1AC86D" />}
                {tx.transactionDirection === 'SENT' && <MaterialIcons name="remove-circle-outline" size={24} color="#F44" />}
              </View>
              <View style={styles.txInfo}>
                <Text style={styles.txTitle}>{tx.content}</Text>
                <Text style={{ fontSize: 12, color: '#888' }}>Receiver: {tx.receiverName}</Text>
                <Text style={styles.txDate}>{tx.createdAt ? new Date(tx.createdAt).toLocaleString() : ''}</Text>
                <Text style={{ fontSize: 12, color: '#888' }}>Jar: { tx.actualJarType ? tx.actualJarType : tx.suggestedJarType || '-'}</Text>
              </View>
              <View style={styles.txAmountWrap}>
                <Text style={[styles.txAmount, tx.transactionDirection === 'RECEIVED' ? styles.income : styles.expense]}>
                  {tx.transactionDirection === 'RECEIVED' ? '+' : '-'} {Math.abs(tx.amount).toLocaleString('vi-VN')} ₫
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 52,
    paddingBottom: 10,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
  },
  payBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A8754',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  payBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
    marginLeft: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    marginLeft: 18,
    marginTop: 12,
    marginBottom: 8,
  },
  txCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 12,
    marginBottom: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#eee',
  },
  txIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F4F6FB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  txInfo: {
    flex: 1,
  },
  txTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  txDate: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  txAmountWrap: {
    minWidth: 120,
    alignItems: 'flex-end',
  },
  txAmount: {
    fontSize: 17,
    fontWeight: '700',
  },
  income: {
    color: '#1AC86D',
  },
  expense: {
    color: '#F44',
  },
}) 