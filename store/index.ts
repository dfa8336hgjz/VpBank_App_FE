import { configureStore } from '@reduxjs/toolkit'
import jarReducer from './jarSlice'

export const store = configureStore({
  reducer: {
    jar: jarReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch 