import { FontAwesome, FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import React, { useEffect } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import PieChart from '../../components/ui/PieChart'
import { getBalanceApi, getJarInfoApi } from '../../services/api'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { updateBalances, updateJarPercentagesFromApi } from '../../store/jarSlice'

const jarIcons = [
  (color: string) => <MaterialIcons name="shopping-cart" size={24} color={color} />,
  (color: string) => <FontAwesome5 name="gift" size={24} color={color} />,
  (color: string) => <MaterialCommunityIcons name="home-outline" size={24} color={color} />,
  (color: string) => <MaterialCommunityIcons name="gamepad-variant-outline" size={24} color={color} />,
  (color: string) => <FontAwesome5 name="hand-holding-heart" size={24} color={color} />,
  (color: string) => <FontAwesome name="diamond" size={24} color={color} />,
]

const jarColors = [
  '#1A75FF',
  '#FF8C00',
  '#4CAF50',
  '#FF4081',
  '#FFD600',
  '#9C27B0',
]

function JarProgress({ percent }: { percent: number }) {
  return (
    <View style={styles.progressBarBg}>
      <View style={[styles.progressBar, { width: `${percent}%` }]} />
    </View>
  )
}

export default function HomeScreen() {
  const dispatch = useAppDispatch()
  const { jars, baseAmount, totalBalance } = useAppSelector(state => state.jar)

  useEffect(() => {
    const loadData = async () => {
      if (totalBalance === 0) {
        try {
          const [jarInfo, balanceInfo] = await Promise.all([
            getJarInfoApi(),
            getBalanceApi()
          ])
          
          if (jarInfo && jarInfo.code === 1000 && jarInfo.result) {
            dispatch(updateJarPercentagesFromApi({
              necessitiesPercentage: jarInfo.result.necessitiesPercentage,
              educationPercentage: jarInfo.result.educationPercentage,
              entertainmentPercentage: jarInfo.result.entertainmentPercentage,
              savingsPercentage: jarInfo.result.savingsPercentage,
              investmentPercentage: jarInfo.result.investmentPercentage,
              givingPercentage: jarInfo.result.givingPercentage
            }))
          }
          
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
        } catch (error) {
          console.log('Error loading data:', error)
        }
      }
    }
    
    loadData()
  }, [dispatch, totalBalance])

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F7F8FA' }}>
      <View style={styles.header}>
        <Ionicons name="person-outline" size={28} color="#222" style={{ marginRight: 8 }} />
        <Text style={styles.hello}>Hello, Minh!</Text>
        <View style={{ flex: 1 }} />
        <View style={styles.diamondBox}>
          <FontAwesome name="diamond" size={16} color="#FFC700" />
          <Text style={styles.diamondText}>1200</Text>
        </View>
        <Ionicons name="notifications-outline" size={24} color="#222" style={{ marginLeft: 16 }} />
        <View style={styles.dot} />
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Jar Overview</Text>
        <View style={styles.totalBalance}>
          <Text style={styles.totalBalanceLabel}>Total Balance</Text>
          <Text style={styles.totalBalanceAmount}>{formatAmount(totalBalance || 0)}</Text>
        </View>
        <View style={styles.chartContainer}>
          <PieChart data={jars.map((j, i) => ({ percent: j.percent, color: jarColors[i] }))} size={120} strokeWidth={24} gapDegree={0} />
        </View>
      </View>
      <Text style={styles.sectionTitle}>Your Jars</Text>
      <View style={styles.jarsWrap}>
        {jars.map((jar, idx) => (
          <View style={styles.jarCard} key={jar.id}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              {jarIcons[idx](jarColors[idx])}
              <Text style={styles.jarLabel}>{jar.label}</Text>
            </View>
            <Text style={styles.jarAmount}>{formatAmount(jar.amount || 0)}</Text>
            <JarProgress percent={jar.percent || 0} />
            <Text style={styles.percentText}>{jar.percent || 0}%</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 52,
    paddingBottom: 10,
    backgroundColor: '#fff',
  },
  hello: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
  },
  diamondBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFC700',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  diamondText: {
    color: '#fff',
    fontWeight: '700',
    marginLeft: 4,
    fontSize: 14,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F44',
    position: 'absolute',
    right: 10,
    top: 18,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginHorizontal: 18,
    marginTop: 12,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#222',
  },
  totalBalance: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  totalBalanceLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#888',
  },
  totalBalanceAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 140,
  },
  chartImg: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    tintColor: '#111',
  },
  chartHint: {
    textAlign: 'center',
    color: '#888',
    fontSize: 14,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    marginLeft: 18,
    marginTop: 12,
    marginBottom: 8,
  },
  jarsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    marginBottom: 24,
  },
  jarCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '47%',
    marginBottom: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  jarLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
    color: '#222',
  },
  jarAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
    marginBottom: 4,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#E6F0FF',
    borderRadius: 3,
    marginTop: 2,
    marginBottom: 2,
    width: '100%',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#1AC86D',
    borderRadius: 3,
  },
  percentText: {
    fontSize: 13,
    color: '#1AC86D',
    fontWeight: '600',
    marginTop: 2,
    textAlign: 'right',
  },
}) 