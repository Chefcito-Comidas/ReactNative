import { useState, useEffect, useRef } from "react";
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useAppDispatch } from "../redux/hooks/hook";
import { login } from "../redux/reducer/user";

type GetUserActions = {
  initializing:boolean,
  user:FirebaseAuthTypes.User,
  setInitializing:(value:boolean)=>void,
  setUser:(value:any)=>void,
}
export const GetUser = ():GetUserActions => {
    const dispatch = useAppDispatch()

    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState<FirebaseAuthTypes.User>(null);
    const onAuthStateChanged  = async (user) => {
      setInitializing(false);
      if(user) {
        setUser(user);
        dispatch(login())
        const token = await user.getIdToken()
        console.log('token',token)
      }
    }
  
    useEffect(()=>{
      const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
      return subscriber; // unsubscribe on unmount
    },[])

    return {
      initializing,
      user,
      setInitializing,
      setUser,
    }
}