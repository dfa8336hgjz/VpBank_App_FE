import { profileAPI } from '@/services/profile-api'
import { updateJarPercentagesFromApi } from '@/store/jarSlice'
import { FontAwesome, FontAwesome5, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import React from 'react'
import { Animated, Easing, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import JarSummary from '../../components/JarSummary'
import Slider from '../../components/ui/Slider'
import { useAppDispatch, useAppSelector } from '../../store/hooks'

const jarIcons = [
  <MaterialIcons name="shopping-cart" size={24} color="#222" />,
  <FontAwesome5 name="gift" size={24} color="#222" />,
  <MaterialCommunityIcons name="home-outline" size={24} color="#222" />,
  <MaterialCommunityIcons name="gamepad-variant-outline" size={24} color="#222" />,
  <FontAwesome5 name="hand-holding-heart" size={24} color="#222" />,
  <FontAwesome name="diamond" size={24} color="#222" />,
]

export default function JarManagementScreen() {
  const dispatch = useAppDispatch()
  const { jars, baseAmount, totalBalance } = useAppSelector((state: any) => state.jar)
  const [percents, setPercents] = React.useState(jars.map((j: any) => j.percent))
  const [showSaved, setShowSaved] = React.useState(false)
  const toastAnim = React.useRef(new Animated.Value(-60)).current
  const toastOpacity = React.useRef(new Animated.Value(0)).current

  React.useEffect(() => {
    setPercents(jars.map((j: any) => j.percent))
  }, [jars])

  const handleChange = (idx: number, value: number) => {
    let totalOther = percents.reduce((sum: number, p: number, i: number) => i === idx ? sum : sum + p, 0)
    let max = 100 - totalOther
    let newValue = Math.round(value)
    if (newValue > max) newValue = max
    if (newValue < 0) newValue = 0
    const newPercents = [...percents]
    newPercents[idx] = newValue
    setPercents(newPercents)
    setShowSaved(false)
  }

  const handleInput = (idx: number, text: string) => {
    let inputValue = parseInt(text.replace(/[^0-9]/g, '')) || 0
    let totalOther = percents.reduce((sum: number, p: number, i: number) => i === idx ? sum : sum + p, 0)
    let max = 100 - totalOther
    if (inputValue > max) inputValue = max
    if (inputValue < 0) inputValue = 0
    const newPercents = [...percents]
    newPercents[idx] = inputValue
    setPercents(newPercents)
    setShowSaved(false)
  }

  const handleSave = async () => {
    try {
      const jarLabels = ['Necessities', 'Education', 'Savings', 'Entertainment', 'Giving', 'Investment']
      const apiPercentages = {
        necessitiesPercentage: percents[jarLabels.indexOf('Necessities')],
        educationPercentage: percents[jarLabels.indexOf('Education')],
        entertainmentPercentage: percents[jarLabels.indexOf('Entertainment')],
        savingsPercentage: percents[jarLabels.indexOf('Savings')],
        investmentPercentage: percents[jarLabels.indexOf('Investment')],
        givingPercentage: percents[jarLabels.indexOf('Giving')]
      }
      
      try {
        await profileAPI.updateJarPercentages(apiPercentages)
      } catch (updateError: any) {
        if (updateError.response?.status === 404) {
          console.log('Jar division not found, creating new one...')
          await profileAPI.updateJarPercentages(apiPercentages)
        } else {
          throw updateError
        }
      }
      
      dispatch(updateJarPercentagesFromApi(percents))
      setShowSaved(true)
      Animated.parallel([
        Animated.timing(toastAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(toastOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start()
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(toastAnim, {
            toValue: -60,
            duration: 300,
            easing: Easing.in(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(toastOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          })
        ]).start(() => setShowSaved(false))
      }, 1200)
    } catch (error) {
      console.error('Failed to save jar percentages:', error)
      alert('Failed to save jar percentages. Please try again.')
    }
  }

  const total = percents.reduce((a: number, b: number) => a + b, 0)
  const currentTotalBalance = totalBalance || baseAmount

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <View style={{ flex: 1 }}>
        <Animated.View style={[styles.snackbar, { transform: [{ translateY: toastAnim }], opacity: toastOpacity }]}> 
          <Text style={styles.snackbarText}>Saved!</Text>
        </Animated.View>
        <ScrollView style={{ flex: 1, backgroundColor: '#F7F8FA' }} contentContainerStyle={{ paddingBottom: 20 }}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Jar Allocation Management</Text>
            <TouchableOpacity style={styles.saveBtnTop} onPress={handleSave}>
              <Text style={styles.saveBtnText}>Save</Text>
            </TouchableOpacity>
          </View>
          <View style={{ height: 8 }} />
          <JarSummary />
          {jars.map((jar: any, idx: number) => {
            const percent = percents[idx]
            const amount = Math.round((percent / 100) * currentTotalBalance)
            let totalOther = percents.reduce((sum: number, p: number, i: number) => i === idx ? sum : sum + p, 0)
            let max = 100 - totalOther
            return (
              <View style={styles.jarCard} key={idx}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                  {jarIcons[idx]}
                  <Text style={styles.jarLabel}>{jar.label}</Text>
                  <View style={{ flex: 1 }} />
                  <TextInput
                    style={styles.percentInput}
                    keyboardType="numeric"
                    value={String(percent)}
                    onChangeText={text => handleInput(idx, text)}
                    maxLength={3}
                  />
                  <Text style={styles.percentNum}>%</Text>
                </View>
                <Slider
                  style={{ width: '100%', height: 28 }}
                  minimumValue={0}
                  maximumValue={max}
                  step={1}
                  minimumTrackTintColor="#1A8754"
                  maximumTrackTintColor="#E6F7EE"
                  thumbTintColor="#1A8754"
                  value={percent}
                  onValueChange={(v: number) => handleChange(idx, v)}
                />
                <Text style={{marginTop: 4, color: '#1A8754', fontWeight: '700', fontSize: 15}}>
                  {amount.toLocaleString('vi-VN')} VND
                </Text>
              </View>
            )
          })}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>{total}%</Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 24,
    paddingBottom: 10,
    paddingHorizontal: 18,
    backgroundColor: '#fff',
  },
  jarCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginHorizontal: 14,
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E6F7EE',
  },
  jarLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 10,
    color: '#222',
  },
  percentInput: {
    width: 50,
    height: 40,
    borderWidth: 1,
    borderColor: '#E6F7EE',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '700',
    color: '#222',
    marginRight: 2,
    paddingHorizontal: 4,
    paddingVertical: 0,
    backgroundColor: '#F7F8FA',
  },
  percentNum: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
    marginLeft: 2,
  },
  progressBarBg: {
    height: 7,
    backgroundColor: '#E6F7EE',
    borderRadius: 4,
    marginTop: 2,
    marginBottom: 2,
    width: '100%',
  },
  progressBar: {
    height: 7,
    backgroundColor: '#1AC86D',
    borderRadius: 4,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginRight: 24,
    marginTop: 8,
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 16,
    color: '#222',
    marginRight: 8,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A75FF',
  },
  saveBtn: {
    backgroundColor: '#1A75FF',
    marginHorizontal: 12,
    borderRadius: 8,
    paddingVertical: 4,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveBtnTop: {
    backgroundColor: '#1A8754',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 32,
    minWidth: 56,
    marginLeft: 8,
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 1,
    textAlign: 'center',
  },
  savedMsg: {
    alignItems: 'center',
    marginBottom: 18,
  },
  savedMsgText: {
    color: '#1AC86D',
    fontWeight: '700',
    fontSize: 16,
  },
  snackbar: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    zIndex: 100,
    alignItems: 'center',
  },
  snackbarText: {
    backgroundColor: '#1A8754',
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    overflow: 'hidden',
  },
}) 