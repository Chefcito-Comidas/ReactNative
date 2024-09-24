import { RestaurantData } from "models/Restauran.model"
import { GetUser } from "../hooks/getUser.hook"
import { apiPost } from "./apiRestWrapper"
import { FirebaseAuthTypes } from "@react-native-firebase/auth"
import { OpinionPost } from "models/opinion.model"

export const PostOpinion = async (value:OpinionPost,user:FirebaseAuthTypes.User) => {
    const token = await user.getIdToken()
    return apiPost<any>({ url: `opinions`,payload:value,customHeaders:{Authorization:`Bearer ${token}`} })
}