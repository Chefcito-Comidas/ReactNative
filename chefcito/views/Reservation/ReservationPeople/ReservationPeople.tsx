import { useEffect } from "react"

export default function ReservationPeople({route, navigation}) {
    useEffect(()=>{
        console.log('new reservation?',route.name==="NewReservationPeople")
    },[])
    return (
        <>
        </>
    )
}