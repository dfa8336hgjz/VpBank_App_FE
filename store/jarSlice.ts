import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Jar {
  id: number
  label: string
  percent: number
  currentBalance: number
}

interface JarState {
  jars: Jar[]
  totalBalance: number
}

const initialState: JarState = {
  jars: [
    { id: 1, label: 'Necessities', percent: 55, currentBalance: 0 },
    { id: 2, label: 'Education', percent: 10, currentBalance: 0 },
    { id: 3, label: 'Savings', percent: 10, currentBalance: 0 },
    { id: 4, label: 'Entertainment', percent: 5, currentBalance: 0 },
    { id: 5, label: 'Giving', percent: 5, currentBalance: 0 },
    { id: 6, label: 'Investment', percent: 15, currentBalance: 0 },
  ],
  totalBalance: 0
}

const jarSlice = createSlice({
  name: 'jar',
  initialState,
  reducers: {
    // updateJarPercent: (state, action: PayloadAction<{ id: number; percent: number }>) => {
    //   const { id, percent } = action.payload
    //   const jarIndex = state.jars.findIndex(jar => jar.id === id)
    //   if (jarIndex !== -1) {
    //     state.jars[jarIndex].percent = percent
    //     const currentTotal = state.totalBalance || state.baseAmount
    //     state.jars[jarIndex].amount = Math.round((percent / 100) * currentTotal)
    //   }
    // },
    // updateAllJarPercents: (state, action: PayloadAction<number[]>) => {
    //   const currentTotal = state.totalBalance || state.baseAmount
    //   state.jars = state.jars.map((jar, index) => ({
    //     ...jar,
    //     percent: action.payload[index] || jar.percent,
    //     amount: Math.round((action.payload[index] || jar.percent) / 100 * currentTotal)
    //   }))
    // },
    // setBaseAmount: (state, action: PayloadAction<number>) => {
    //   state.baseAmount = action.payload
    //   state.totalBalance = action.payload
    //   const totalPercent = state.jars.reduce((sum, jar) => sum + jar.percent, 0)
    //   if (totalPercent === 100) {
    //     state.jars = state.jars.map(jar => ({
    //       ...jar,
    //       amount: Math.round((jar.percent / 100) * action.payload)
    //     }))
    //   }
    // },
    // recalculateAmounts: (state) => {
    //   const currentTotal = state.totalBalance || state.baseAmount
    //   const totalPercent = state.jars.reduce((sum, jar) => sum + jar.percent, 0)
    //   if (totalPercent === 100) {
    //     state.jars = state.jars.map(jar => ({
    //       ...jar,
    //       amount: Math.round((jar.percent / 100) * currentTotal)
    //     }))
    //   }
    // },
    // saveJarPercents: (state) => {
    //   const currentTotal = state.totalBalance || state.baseAmount
    //   const totalPercent = state.jars.reduce((sum, jar) => sum + jar.percent, 0)
    //   if (totalPercent === 100) {
    //     state.jars = state.jars.map(jar => ({
    //       ...jar,
    //       amount: Math.round((jar.percent / 100) * currentTotal)
    //     }))
    //   }
    // },
    // setJars: (state, action: PayloadAction<{ jars: any[], baseAmount?: number }>) => {
    //   state.jars = action.payload.jars
    //   if (action.payload.baseAmount !== undefined) {
    //     state.totalBalance = action.payload.baseAmount
    //   }
    // },
    // updateBalances: (state, action: PayloadAction<{
    //   necessitiesBalance: number,
    //   educationBalance: number,
    //   entertainmentBalance: number,
    //   savingsBalance: number,
    //   investmentBalance: number,
    //   givingBalance: number,
    //   totalBalance: number
    // }>) => {
    //   const { necessitiesBalance, educationBalance, entertainmentBalance, savingsBalance, investmentBalance, givingBalance, totalBalance } = action.payload
      
    //   const balanceMapping = [
    //     necessitiesBalance,
    //     educationBalance,
    //     savingsBalance,
    //     entertainmentBalance,
    //     givingBalance,
    //     investmentBalance
    //   ]
      
    //   state.jars = state.jars.map((jar, index) => ({
    //     ...jar,
    //     currentBalance: balanceMapping[index] || jar.currentBalance
    //   }))
      
    //   state.totalBalance = totalBalance
      
    //   if (totalBalance > 0) {
    //     state.jars = state.jars.map(jar => ({
    //       ...jar,
    //       percent: Math.max(0, Math.round((jar.currentBalance / totalBalance) * 100))
    //     }))
    //   }
    // },
    updateJarPercentagesFromApi: (state, action: PayloadAction<{
      necessitiesPercentage: number,
      educationPercentage: number,
      entertainmentPercentage: number,
      savingsPercentage: number,
      investmentPercentage: number,
      givingPercentage: number
    }>) => {
      const { necessitiesPercentage, educationPercentage, entertainmentPercentage, savingsPercentage, investmentPercentage, givingPercentage } = action.payload
      
      const percentageMapping = [
        necessitiesPercentage,
        educationPercentage,
        savingsPercentage,
        entertainmentPercentage,
        givingPercentage,
        investmentPercentage
      ]
      
      state.jars = state.jars.map((jar, index) => ({
        ...jar,
        percent: percentageMapping[index] || jar.percent
      }))
    },

    updateBalancesFromApi: (state, action: PayloadAction<{
      necessitiesBalance: number,
      educationBalance: number,
      entertainmentBalance: number,
      savingsBalance: number,
      investmentBalance: number,
      givingBalance: number,
      totalBalance: number
    }>) => {
      const { necessitiesBalance, educationBalance, entertainmentBalance, savingsBalance, investmentBalance, givingBalance, totalBalance } = action.payload

      const balanceMapping = [
        necessitiesBalance,
        educationBalance,
        savingsBalance,
        entertainmentBalance,
        givingBalance,
        investmentBalance
      ]

      state.jars = state.jars.map((jar, index) => ({
        ...jar,
        currentBalance: balanceMapping[index] || jar.currentBalance
      }))
      
      state.totalBalance = totalBalance
    }
  }
})

export const { updateJarPercentagesFromApi, updateBalancesFromApi } = jarSlice.actions
export default jarSlice.reducer 