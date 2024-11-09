import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from "../store/store"
import { FirebaseAuthTypes } from '@react-native-firebase/auth'

// Define a type for the slice state
interface UserState {
  user: any;
  initializing:boolean
}

// Define the initial state using that type
const initialState: UserState = {
  user: null,
  initializing:true
}

export const userSlice = createSlice({
  name: 'user',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    login: (state) => {
      state.initializing = false
    },
    signout:(state) => {
        state.user = null
        state.initializing = true
    }
  },
})

export const { login, signout } = userSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectUser = (state: RootState) => state.user.user

export default userSlice.reducer