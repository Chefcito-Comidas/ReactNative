import { RestaurantData,RestaurantLocationData } from "models/Restauran.model"
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
    return apiGet<RestaurantData>({url:'venues?limit=100&start=0',customHeaders:{Authorization:`Bearer ${token}`} })
}

export const getRestaurantWithLocation = async (user:FirebaseAuthTypes.User,latitud,longitud) => {
    const token = await user.getIdToken()
    return apiGet<RestaurantLocationData>({url:`venues/near?location=${latitud}&location=${longitud}`,customHeaders:{Authorization:`Bearer ${token}`} })
}

export const getRestaurantById = async (user:FirebaseAuthTypes.User,id:string) => {
    const token = await user.getIdToken()
    return apiGet<RestaurantData>({url:`venues?limit=10&start=0&id=${id}`,customHeaders:{Authorization:`Bearer ${token}`} })
}

export const getRestaurantPromotion = async (user:FirebaseAuthTypes.User) => {
    const token = await user.getIdToken()
    return apiGet<RestaurantData>({url:'venues/promotions',customHeaders:{Authorization:`Bearer ${token}`} })
}