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

const loginWithGoogleCredentials = async (token:string) => {
    try {
        const googleCredential = auth.GoogleAuthProvider.credential(token);
        return auth().signInWithCredential(googleCredential);
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

const resetpassword = async (email:string) => {
    try {
        auth().sendPasswordResetEmail(email)
        alert('Email para recuperacion de contraseña enviado');
    }
    catch(error) {
        console.log("error ===>", error);
    }
}

export {
    loginUserPassword,
    createUserPassword,
    signOut,
    loginWithGoogleCredentials,
    resetpassword,
};