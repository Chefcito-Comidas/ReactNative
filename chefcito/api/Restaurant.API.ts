import { Restaurant } from "models/Restauran.model"
import { GetUser } from "../hooks/getUser.hook"
import { apiGet } from "./apiRestWrapper"
import { FirebaseAuthTypes } from "@react-native-firebase/auth"

// export type RestaurantAPIActions = {
//     getRestaurant:()=>Promise<Restaurant[]>
// }

// const useRestaurant = ():RestaurantAPIActions =>{

//     const {user} = GetUser()
//     const getRestaurant = async () => {
//         const token = await user.getIdToken()
//         return apiGet<Restaurant[]>({url:'venues?limit=10&start=0',customHeaders:{Authorization:`Bearer ${token}`} })
//     }
//     return {
//         getRestaurant
//     }
// }

// export default useRestaurant

export const getRestaurant = async (user:FirebaseAuthTypes.User) => {
    const token = await user.getIdToken()
    return apiGet<Restaurant[]>({url:'venues?limit=10&start=0',customHeaders:{Authorization:`Bearer ${token}`} })
}