import { UserPost } from "../models/user.model"
import { apiPost } from "./apiRestWrapper"

export const CreateUser = async (token:string,name:string='',number:string=''): Promise<UserPost> => {
    return apiPost<UserPost>({ url: `users`,payload:{user_type: "client",name,number},customHeaders:{Authorization:`Bearer ${token}`} })
}