import transactionAPI from '@/services/transaction-api'
import { FontAwesome, MaterialIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const getJarIcon = (jarType: string) => {
  switch (jarType) {
    case 'NECESSITIES':
      return <MaterialIcons name="shopping-cart" size={20} color="#1A8754" />
    case 'EDUCATION':
      return <MaterialIcons name="school" size={20} color="#FF8C00" />
    case 'ENTERTAINMENT':
      return <MaterialIcons name="movie" size={20} color="#FF4081" />
    case 'SAVINGS':
      return <MaterialIcons name="savings" size={20} color="#4CAF50" />
    case 'INVESTMENT':
      return <MaterialIcons name="trending-up" size={20} color="#9C27B0" />
    case 'GIVING':
      return <MaterialIcons name="favorite" size={20} color="#FFD600" />
    default:
      return <MaterialIcons name="account-balance-wallet" size={20} color="#666" />
  }
}

const getTransactionIcon = (direction: string) => {
  if (direction === 'RECEIVED') {
    return <View style={styles.transactionIconReceived}><MaterialIcons name="arrow-downward" size={16} color="#fff" /></View>
  } else {
    return <View style={styles.transactionIconSent}><MaterialIcons name="arrow-upward" size={16} color="#fff" /></View>
  }
}

export default function TransferScreen() {
  const router = useRouter()
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true)
      try {
        console.log("fetchHistory")
        const data = await transactionAPI.getTransactionHistory()
        setTransactions(data.result)
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
              <View style={styles.txIconContainer}>
                {getTransactionIcon(tx.transactionDirection)}
                <View style={styles.jarIconContainer}>
                  {getJarIcon(tx.actualJarType || tx.suggestedJarType)}
                </View>
              </View>
              <View style={styles.txInfo}>
                <Text style={styles.txTitle}>{tx.content}</Text>
                <View style={styles.txDetails}>
                  <Text style={styles.txSubText}>
                    {tx.transactionDirection === 'RECEIVED' ? 'From: ' : 'To: '}{tx.receiverName}
                  </Text>
                  <Text style={styles.txDate}>{tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : ''}</Text>
                </View>
                <View style={styles.jarInfo}>
                  {getJarIcon(tx.actualJarType || tx.suggestedJarType)}
                  <Text style={styles.jarText}>{tx.actualJarType || tx.suggestedJarType || 'Unknown'}</Text>
                </View>
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
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  txIconContainer: {
    alignItems: 'center',
    marginRight: 12,
  },
  transactionIconReceived: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1A8754',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  transactionIconSent: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF4757',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  jarIconContainer: {
    opacity: 0.8,
  },
  txInfo: {
    flex: 1,
    marginRight: 12,
  },
  txTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
    marginBottom: 4,
  },
  txDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  txSubText: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  txDate: {
    fontSize: 12,
    color: '#888',
  },
  jarInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  jarText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
    textTransform: 'capitalize',
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