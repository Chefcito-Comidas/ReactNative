import { useState, useEffect, useRef } from "react";
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
type GetUserActions = {
  initializing:boolean,
  user:FirebaseAuthTypes.User
}
export const GetUser = ():GetUserActions => {
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState<FirebaseAuthTypes.User>(null);
    const onAuthStateChanged  = async (user) => {
      setInitializing(false);
      if(user) {
        setUser(user);
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
    }
}