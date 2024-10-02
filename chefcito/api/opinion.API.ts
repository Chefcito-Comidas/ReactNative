import { RestaurantData } from "models/Restauran.model"
import { GetUser } from "../hooks/getUser.hook"
import { apiGet, apiPost } from "./apiRestWrapper"
import { FirebaseAuthTypes } from "@react-native-firebase/auth"
import { OpinionPost, Summary } from "models/opinion.model"

export const PostOpinion = async (value:OpinionPost,user:FirebaseAuthTypes.User) => {
    const token = await user.getIdToken()
    return apiPost<any>({ url: `opinions`,payload:value,customHeaders:{Authorization:`Bearer ${token}`} })
}

export const GetOpinion = async (user:FirebaseAuthTypes.User,id:string) => {
    const token = await user.getIdToken()
    return apiGet<any>({url:`opinions`,customHeaders:{Authorization:`Bearer ${token}`} })
}

export const GetSummary = async (user:FirebaseAuthTypes.User,venue:string) => {
    const token = await user.getIdToken()
    return apiGet<any>({url:`summaries/${venue}`,customHeaders:{Authorization:`Bearer ${token}`} })
}

export const GetSummaries = async (user:FirebaseAuthTypes.User,venue:string) => {
    const token = await user.getIdToken()
    return apiGet<any>({url:`opinion?venue=${venue}}`,customHeaders:{Authorization:`Bearer ${token}`} })
}



