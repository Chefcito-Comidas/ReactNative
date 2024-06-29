/* eslint-disable @typescript-eslint/no-unused-vars */
import auth from '@react-native-firebase/auth';


const loginUserPassword = async (email:string,password:string) => {
    try {
        const user = await auth().signInWithEmailAndPassword(email, password)
        return user.user
    } catch (error:any) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("Error: ",errorCode,errorMessage)
        return null
    }
}

const createUserPassword = async (email:string,password:string) => {
    try {
        const user = await auth().createUserWithEmailAndPassword(email, password)
        return user.user
    } catch (error:any) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("Error: ",errorCode,errorMessage)
        return null
    }
}

const signOut = async () => {
    try {
        await auth().signOut()
        return
    } catch (error:any) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("Error: ",errorCode,errorMessage)
        return
    }
}

export {
    loginUserPassword,
    createUserPassword,
    signOut,
};