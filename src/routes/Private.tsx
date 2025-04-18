import { ReactNode, useEffect, useState } from 'react'
import {auth} from '../../src/services/firebaseConnection'
import { onAuthStateChanged } from 'firebase/auth'
import { Navigate } from 'react-router-dom'
interface PrivateProps{
    children: ReactNode
}

export function Private({ children }: PrivateProps){
    const[loading, setLoading]= useState(true)
    const[singned, setSigned] = useState(false);


    useEffect(()=>{
        const unsub = onAuthStateChanged(auth, (user)=>{
            if(user){
                const userData = {
                    uid: user?.uid,
                    email: user?.email,
                }

                localStorage.setItem("@reactlinks",JSON.stringify(userData))
                setLoading(false)
                setSigned(true)

            }else{
                setLoading(false)
                setSigned(false)
            }
        })

        return ()=>{
            unsub()
        }

    },[])


    if(loading){
        return <div></div>
    }

    if(!singned){
        return <Navigate to="/login"/>
    }


    return children;
}