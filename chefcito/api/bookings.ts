import { apiPost } from "./apiRestWrapper"
import {NewBookingPost} from "../models/NewBooking.model";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";

export const PostBooking = async (value:NewBookingPost,user:FirebaseAuthTypes.User) => {
    const token = await user.getIdToken()
    return apiPost<any>({ url: `reservations`,payload:value,customHeaders:{Authorization:`Bearer ${token}`} })
}