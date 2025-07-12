import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Jar {
  id: number
  label: string
  percent: number
  amount: number
}

interface JarState {
  jars: Jar[]
  baseAmount: number
  totalAmount: number
}

const initialState: JarState = {
  jars: [
    { id: 1, label: 'Essentials', percent: 55, amount: 0 },
    { id: 2, label: 'Education', percent: 10, amount: 0 },
    { id: 3, label: 'Long-term Savings', percent: 10, amount: 0 },
    { id: 4, label: 'Entertainment', percent: 5, amount: 0 },
    { id: 5, label: 'Giving', percent: 5, amount: 0 },
    { id: 6, label: 'Financial Freedom', percent: 15, amount: 0 },
  ],
  baseAmount: 1000000,
  totalAmount: 0
}

const calculateTotals = (state: JarState) => {
  state.totalAmount = state.jars.reduce((sum, jar) => sum + jar.amount, 0)
}

const jarSlice = createSlice({
  name: 'jar',
  initialState,
  reducers: {
    updateJarPercent: (state, action: PayloadAction<{ id: number; percent: number }>) => {
      const { id, percent } = action.payload
      const jarIndex = state.jars.findIndex(jar => jar.id === id)
      if (jarIndex !== -1) {
        state.jars[jarIndex].percent = percent
        calculateTotals(state)
      }
    },
    updateAllJarPercents: (state, action: PayloadAction<number[]>) => {
      state.jars = state.jars.map((jar, index) => ({
        ...jar,
        percent: action.payload[index] || jar.percent,
      }))
      calculateTotals(state)
    },
    calculateJarAmounts: (state, action: PayloadAction<number>) => {
      const totalAmount = action.payload
      state.jars = state.jars.map(jar => ({
        ...jar,
        amount: Math.round((jar.percent / 100) * totalAmount)
      }))
      calculateTotals(state)
    },
    setBaseAmount: (state, action: PayloadAction<number>) => {
      state.baseAmount = action.payload
      const totalPercent = state.jars.reduce((sum, jar) => sum + jar.percent, 0)
      if (totalPercent === 100) {
        state.jars = state.jars.map(jar => ({
          ...jar,
          amount: Math.round((jar.percent / 100) * action.payload)
        }))
      }
      calculateTotals(state)
    },
    recalculateAmounts: (state) => {
      const totalPercent = state.jars.reduce((sum, jar) => sum + jar.percent, 0)
      if (totalPercent === 100) {
        state.jars = state.jars.map(jar => ({
          ...jar,
          amount: Math.round((jar.percent / 100) * state.baseAmount)
        }))
      }
      calculateTotals(state)
    },
    saveJarPercents: (state) => {
      const totalPercent = state.jars.reduce((sum, jar) => sum + jar.percent, 0)
      if (totalPercent === 100) {
        state.jars = state.jars.map(jar => ({
          ...jar,
          amount: Math.round((jar.percent / 100) * state.baseAmount)
        }))
      }
      calculateTotals(state)
    }
  }
})

export const { updateJarPercent, updateAllJarPercents, calculateJarAmounts, setBaseAmount, recalculateAmounts, saveJarPercents } = jarSlice.actions
export default jarSlice.reducer 