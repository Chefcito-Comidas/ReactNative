import { FirebaseAuthTypes } from "@react-native-firebase/auth"
import { GetUser } from "../hooks/getUser.hook"
import { apiPost, apiPut } from "./apiRestWrapper"
import { apiGet } from "./apiRestWrapper"
import { Profile } from "models/user.model"

export const getProfileData = async (user:FirebaseAuthTypes.User) => {
    const token = await user.getIdToken()
    return apiGet<Profile>({url:`users`,customHeaders:{Authorization:`Bearer ${token}`} })
}

export const putProfileData = async (user: FirebaseAuthTypes.User, updatedProfile: { name: string; phone: string }) => {
    const token = await user.getIdToken()
    return apiPut<Profile>({url:`users`,customHeaders:{Authorization:`Bearer ${token}`},payload:updatedProfile})
}