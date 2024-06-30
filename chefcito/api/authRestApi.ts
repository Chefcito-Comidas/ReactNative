import { UserPost } from "../models/user.model"
import { apiPost } from "./apiRestWrapper"

export const getSearchResult = async (token:string): Promise<UserPost> => {
    return apiPost<UserPost>({ url: `users`,payload:{user_type: "user"},customHeaders:{Authorization:`Bearer ${token}`} })
}