import { FontAwesome, FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import React, { useEffect, useState } from 'react'
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import PieChart from '../../components/ui/PieChart'
import { getBalanceApi, getJarInfoApi, getNotificationsApi } from '../../services/api'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { updateBalances, updateJarPercentagesFromApi } from '../../store/jarSlice'

interface Notification {
  id: string
  title: string
  content: string
  type: string
  senderId: string
  createdAt: string
  readAt: string | null
  deliveredAt: string
  global: boolean
  read: boolean
}

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

function NotificationSidebar({ visible, onClose, notifications }: { 
  visible: boolean
  onClose: () => void
  notifications: Notification[]
}) {
  console.log('NotificationSidebar rendered with:', { visible, notificationCount: notifications.length })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Vừa xong'
    if (diffInHours < 24) return `${diffInHours} giờ trước`
    return `${Math.floor(diffInHours / 24)} ngày trước`
  }

  console.log('NotificationSidebar rendering Modal with visible:', visible)
  
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity 
          style={styles.overlayBackground}
          activeOpacity={1}
          onPress={onClose}
        />
        <View 
          style={[
            styles.sidebar
          ]}
        >
          <View style={styles.sidebarHeader}>
            <Text style={styles.sidebarTitle}>Notifications ({notifications.length})</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.notificationList}>
              {notifications.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>No notifications</Text>
                </View>
              ) : (
                <>
                  {notifications.map((notification, index) => {
                    console.log(`Rendering notification ${index}:`, notification.title)
                    return (
                      <View key={notification.id} style={styles.notificationItem}>
                        <View style={styles.notificationHeader}>
                          <View style={[styles.notificationDot, { backgroundColor: notification.read ? '#ddd' : '#1A75FF' }]} />
                          <Text style={styles.notificationTitle}>{notification.title}</Text>
                        </View>
                        <Text style={styles.notificationContent}>{notification.content}</Text>
                        <Text style={styles.notificationTime}>{formatDate(notification.createdAt)}</Text>
                      </View>
                    )
                  })}
                </>
              )}
            </ScrollView>
        </View>
      </View>
    </Modal>
  )
}

export default function HomeScreen() {
  const dispatch = useAppDispatch()
  const { jars, baseAmount, totalBalance } = useAppSelector(state => state.jar)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [sidebarVisible, setSidebarVisible] = useState(false)
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false)
  let intervalRef: number | null = null

  const fetchNotifications = async () => {
    try {
      const response = await getNotificationsApi()
      console.log('Notifications response:', response)
      if (response && response.code === 1000 && response.result) {
        console.log('Setting notifications:', response.result)
        console.log('Notification read status:', response.result.map((n: Notification) => ({ id: n.id, read: n.read })))
        setNotifications(response.result)
        const hasUnread = response.result.length > 0 && response.result.some((n: Notification) => !n.read)
        setHasUnreadNotifications(hasUnread)
        console.log('Has unread notifications:', hasUnread)
      } else {
        console.log('No notifications or invalid response')
        setNotifications([])
        setHasUnreadNotifications(false)
      }
    } catch (error) {
      console.log('Error fetching notifications:', error)
      setNotifications([])
      setHasUnreadNotifications(false)
    }
  }

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

  useEffect(() => {
    console.log('Setting up notifications...')
    fetchNotifications()
    
    intervalRef = setInterval(fetchNotifications, 3000)
    
    return () => {
      if (intervalRef) {
        clearInterval(intervalRef)
      }
    }
  }, [])

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
        <TouchableOpacity onPress={() => {
          console.log('Notification button pressed, current notifications:', notifications.length)
          console.log('Current sidebarVisible state:', sidebarVisible)
          setSidebarVisible(true)
          console.log('Set sidebarVisible to true')
        }} style={{ marginLeft: 16 }}>
          <Ionicons 
            name="notifications-outline" 
            size={24} 
            color={hasUnreadNotifications ? "#1A75FF" : "#222"} 
          />
          {hasUnreadNotifications && <View style={styles.dot} />}
        </TouchableOpacity>
      </View>

      <NotificationSidebar 
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        notifications={notifications}
      />

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Jar Overview</Text>
        <View style={styles.totalBalance}>
          <Text style={styles.totalBalanceLabel}>Total Balance</Text>
          <Text style={styles.totalBalanceAmount}>{formatAmount(totalBalance || 0)}</Text>
        </View>
        <View style={styles.chartContainer}>
          <PieChart data={jars.map((j, i) => ({ 
            percent: Math.max(0, j.percent || 0), 
            color: jarColors[i] 
          }))} size={120} strokeWidth={24} gapDegree={0} />
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
    right: -2,
    top: -2,
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
          backgroundColor: '#E6F7EE',
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
  overlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  overlayBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  sidebar: {
    width: '80%',
    height: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    padding: 10,
    paddingTop: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sidebarTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
  },
  notificationList: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 10,
    paddingTop: 5,
  },
  notificationItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#1A75FF',
    minHeight: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 6,
    lineHeight: 20,
  },
  notificationContent: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    lineHeight: 18,
  },
  notificationTime: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    minHeight: 200,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
}) 