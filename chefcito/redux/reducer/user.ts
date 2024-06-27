import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from "../store/store"
import { FirebaseAuthTypes } from '@react-native-firebase/auth'

// Define a type for the slice state
interface UserState {
  user: any
}

// Define the initial state using that type
const initialState: UserState = {
  user: null,
}

export const userSlice = createSlice({
  name: 'user',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    login: (state,action: PayloadAction<FirebaseAuthTypes.User>) => {
      state.user = action?.payload
    },
    signout:(state) => {
        state.user = null
    }
  },
})

export const { login, signout } = userSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectUser = (state: RootState) => state.user.user

export default userSlice.reducer