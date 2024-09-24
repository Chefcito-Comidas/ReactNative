import { FirebaseAuthTypes } from "@react-native-firebase/auth"
import { GetUser } from "../hooks/getUser.hook"
import { apiPost } from "./apiRestWrapper"
import { apiGet } from "./apiRestWrapper"
import { Profile } from "models/user.model"

export const getProfileData = async (user:FirebaseAuthTypes.User) => {
    const token = await user.getIdToken()
    return apiGet<Profile>({url:`users`,customHeaders:{Authorization:`Bearer ${token}`} })
}