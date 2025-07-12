import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { setBaseAmount } from '../store/jarSlice'

export default function JarSummary() {
  const dispatch = useAppDispatch()
  const { jars, baseAmount, totalAmount } = useAppSelector((state: any) => state.jar)
  const [inputBaseAmount, setInputBaseAmount] = React.useState(String(baseAmount))

  const totalPercent = jars.reduce((sum: number, jar: any) => sum + jar.percent, 0)

  const handleSetBaseAmount = () => {
    const amount = parseInt(inputBaseAmount) || 0
    dispatch(setBaseAmount(amount))
  }

  React.useEffect(() => {
    setInputBaseAmount(String(baseAmount))
  }, [baseAmount])

  return (
    <View style={styles.container}>
      <View style={styles.totalSection}>
        <Text style={styles.totalTitle}>Total Amount:</Text>
        <Text style={styles.totalAmount}>
          {totalAmount.toLocaleString('vi-VN')} VND
        </Text>
        <Text style={styles.totalPercent}>Total: {totalPercent}%</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 14,
    margin: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  totalSection: {
    marginBottom: 20,
    alignItems: 'center',
  },
  totalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A8754',
    marginBottom: 4,
  },
  totalPercent: {
    fontSize: 14,
    color: '#888',
  },
}) 